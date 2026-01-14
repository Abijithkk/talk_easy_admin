"use client";
import { useEffect, useRef, useState } from "react";

const HearingModal = ({ isOpen, onClose, channelName, callId, token, executiveToken, uid, calleeUid }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [AgoraRTC, setAgoraRTC] = useState(null);

  const clientRef = useRef(null);
  const executiveClientRef = useRef(null); // New client for executive

  // Dynamically load AgoraRTC (only on client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("agora-rtc-sdk-ng").then((mod) => {
        setAgoraRTC(mod.default);
      });
    }
  }, []);

  // Initialize Agora clients
  useEffect(() => {
    if (isOpen && AgoraRTC && !clientRef.current) {
      // Client for user side
      clientRef.current = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
        region: "asia",
      });

      // Client for executive side
      executiveClientRef.current = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
        region: "asia",
      });
    }
  }, [isOpen, AgoraRTC]);

  // Connect to channel when modal opens
  useEffect(() => {
    if (isOpen && channelName && clientRef.current && executiveClientRef.current && token && executiveToken) {
      connectToChannel();
    }

    return () => {
      cleanup();
    };
  }, [isOpen, channelName, AgoraRTC, token, executiveToken]);

  const connectToChannel = async () => {
    if (!clientRef.current || !executiveClientRef.current || isConnecting || isConnected || !AgoraRTC || !token || !executiveToken) {
      console.error('Missing requirements:', { 
        client: !!clientRef.current, 
        executiveClient: !!executiveClientRef.current,
        connecting: isConnecting, 
        connected: isConnected, 
        AgoraRTC: !!AgoraRTC, 
        token: !!token,
        executiveToken: !!executiveToken
      });
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError("");

      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
      
      // Set up event listeners for user client
      clientRef.current.on("user-published", handleUserPublished);
      clientRef.current.on("user-unpublished", handleUserUnpublished);
      clientRef.current.on("user-joined", handleUserJoined);
      clientRef.current.on("user-left", handleUserLeft);
      clientRef.current.on("connection-state-change", (state) => {
        console.log('User client connection state:', state);
      });

      // Set up event listeners for executive client
      executiveClientRef.current.on("user-published", handleExecutiveUserPublished);
      executiveClientRef.current.on("user-unpublished", handleExecutiveUserUnpublished);
      executiveClientRef.current.on("user-joined", handleExecutiveUserJoined);
      executiveClientRef.current.on("user-left", handleExecutiveUserLeft);
      executiveClientRef.current.on("connection-state-change", (state) => {
        console.log('Executive client connection state:', state);
      });

      // Join the channel with both user and executive
      console.log('Joining as user with UID:', uid);
      await clientRef.current.join(appId, channelName, token, uid || null);
      
      console.log('Joining as executive with UID:', calleeUid);
      await executiveClientRef.current.join(appId, channelName, executiveToken, calleeUid || null);
      
      console.log('Successfully joined channel from both sides:', channelName);
      setIsConnected(true);
      setIsConnecting(false);
    } catch (error) {
      console.error("Failed to join channel:", error);
      setConnectionError(`Failed to connect: ${error.message}`);
      setIsConnecting(false);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    console.log('User published (user side):', user.uid, mediaType);
    await handleUserPublishedCommon(user, mediaType, "user");
  };

  const handleExecutiveUserPublished = async (user, mediaType) => {
    console.log('User published (executive side):', user.uid, mediaType);
    await handleUserPublishedCommon(user, mediaType, "executive");
  };

  const handleUserPublishedCommon = async (user, mediaType, clientType) => {
    if (mediaType === "audio") {
      try {
        const client = clientType === "executive" ? executiveClientRef.current : clientRef.current;
        await client.subscribe(user, mediaType);
        const remoteAudioTrack = user.audioTrack;
        
        if (remoteAudioTrack) {
          // Create unique ID for this user+client combination to avoid duplicates
          const uniqueId = `${user.uid}-${clientType}`;
          
          // Create audio element and play
          remoteAudioTrack.play();
          setAudioTracks((prev) => [...prev, { track: remoteAudioTrack, id: uniqueId }]);
          
          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uniqueId === uniqueId);
            if (!exists) {
              return [
                ...prev,
                { 
                  uid: user.uid, 
                  uniqueId,
                  clientType,
                  hasAudio: true, 
                  audioTrack: remoteAudioTrack,
                  isSpeaking: false 
                },
              ];
            }
            return prev.map(u => 
              u.uniqueId === uniqueId ? { ...u, hasAudio: true, audioTrack: remoteAudioTrack } : u
            );
          });
        }
      } catch (error) {
        console.error(`Error subscribing to user on ${clientType} side:`, error);
      }
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    console.log('User unpublished (user side):', user.uid, mediaType);
    handleUserUnpublishedCommon(user, mediaType, "user");
  };

  const handleExecutiveUserUnpublished = (user, mediaType) => {
    console.log('User unpublished (executive side):', user.uid, mediaType);
    handleUserUnpublishedCommon(user, mediaType, "executive");
  };

  const handleUserUnpublishedCommon = (user, mediaType, clientType) => {
    if (mediaType === "audio") {
      const uniqueId = `${user.uid}-${clientType}`;
      setRemoteUsers((prev) =>
        prev.map((u) =>
          u.uniqueId === uniqueId ? { ...u, hasAudio: false } : u
        )
      );
    }
  };

  const handleUserJoined = (user) => {
    console.log("User joined (user side):", user.uid);
    handleUserJoinedCommon(user, "user");
  };

  const handleExecutiveUserJoined = (user) => {
    console.log("User joined (executive side):", user.uid);
    handleUserJoinedCommon(user, "executive");
  };

  const handleUserJoinedCommon = (user, clientType) => {
    const uniqueId = `${user.uid}-${clientType}`;
    setRemoteUsers((prev) => {
      const exists = prev.find((u) => u.uniqueId === uniqueId);
      if (!exists) {
        return [...prev, { 
          uid: user.uid, 
          uniqueId,
          clientType,
          hasAudio: false, 
          isSpeaking: false 
        }];
      }
      return prev;
    });
  };

  const handleUserLeft = (user) => {
    console.log("User left (user side):", user.uid);
    handleUserLeftCommon(user, "user");
  };

  const handleExecutiveUserLeft = (user) => {
    console.log("User left (executive side):", user.uid);
    handleUserLeftCommon(user, "executive");
  };

  const handleUserLeftCommon = (user, clientType) => {
    const uniqueId = `${user.uid}-${clientType}`;
    setRemoteUsers((prev) => prev.filter((u) => u.uniqueId !== uniqueId));
  };

  const cleanup = async () => {
    console.log('Cleaning up Agora connections...');
    
    // Stop all audio tracks
    audioTracks.forEach(({ track }) => {
      try {
        track.stop();
      } catch (error) {
        console.error('Error stopping track:', error);
      }
    });

    // Leave channels if connected
    if (clientRef.current) {
      try {
        clientRef.current.removeAllListeners();
        await clientRef.current.leave();
      } catch (error) {
        console.error('Error leaving user channel:', error);
      }
    }

    if (executiveClientRef.current) {
      try {
        executiveClientRef.current.removeAllListeners();
        await executiveClientRef.current.leave();
      } catch (error) {
        console.error('Error leaving executive channel:', error);
      }
    }

    setAudioTracks([]);
    setRemoteUsers([]);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionError("");
  };

  const handleClose = async () => {
    await cleanup();
    onClose();
  };

  // Auto-cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanup();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Listen to Call (Both Sides)</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Call Information */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Call ID:</span>
              <span className="text-sm text-gray-900 font-mono">#{callId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Channel:</span>
              <span className="text-sm text-gray-900 font-mono truncate max-w-[200px]">{channelName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">User Token:</span>
              <span className="text-sm text-gray-900 font-mono truncate max-w-[150px]" title={token}>
                {token ? '✓ Available' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Executive Token:</span>
              <span className="text-sm text-gray-900 font-mono truncate max-w-[150px]" title={executiveToken}>
                {executiveToken ? '✓ Available' : '✗ Missing'}
              </span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected
                    ? "bg-green-500"
                    : isConnecting
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isConnected
                  ? "Connected - Listening to both sides"
                  : isConnecting
                  ? "Connecting to channel..."
                  : "Disconnected"}
              </span>
            </div>
            {(!token || !executiveToken) && (
              <p className="text-xs text-red-600 mt-2">
                {!token && !executiveToken 
                  ? "Both tokens are missing. Cannot connect to call." 
                  : !token 
                    ? "User token missing." 
                    : "Executive token missing."}
              </p>
            )}
          </div>

          {/* Remote Users */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Participants ({remoteUsers.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {remoteUsers.map((user) => (
                <div
                  key={user.uniqueId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.clientType === "executive" ? "bg-purple-500" : "bg-blue-500"
                    }`}>
                      <span className="text-white text-sm font-medium">
                        {String(user.uid).slice(-2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.clientType === "executive" ? "Executive" : "User"} {user.uid}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.hasAudio ? "Audio available" : "No audio"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {user.clientType}
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.hasAudio ? "bg-green-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}

              {remoteUsers.length === 0 && !isConnecting && isConnected && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Waiting for participants to join...
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {connectionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-red-700">{connectionError}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex space-x-3">
            {!isConnected && !isConnecting && token && executiveToken && (
              <button
                onClick={connectToChannel}
                disabled={!token || !executiveToken}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Connect to Both Sides
              </button>
            )}

            {(isConnected || isConnecting) && (
              <button
                onClick={handleClose}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                {isConnecting ? 'Cancel' : 'Stop Listening'}
              </button>
            )}

            {isConnecting && (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HearingModal;