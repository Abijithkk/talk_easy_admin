"use client";
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBannedUsers } from '@/redux/slices/userSlice';
import { DataTablePagination } from "@/components/layout/Pagination";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const BannedUsersPage = () => {
  const dispatch = useDispatch();
  const { bannedUsers, bannedUsersLoading, bannedUsersError } = useSelector(state => state.users);

  // Transform your data for the table
  const tableData = useMemo(() => {
    return bannedUsers?.results || [];
  }, [bannedUsers]);

  // Define columns
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('user_id', {
      header: 'User ID',
      cell: (info) => (
        <div className="text-sm font-medium text-gray-900 font-mono">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor(row => ({
      mobile: row.mobile_number,
      email: row.email
    }), {
      id: 'contact',
      header: 'Contact',
      cell: (info) => {
        const { mobile, email } = info.getValue();
        return (
          <div className="text-sm text-gray-900">
            {mobile && (
              <div className="flex flex-col">
                <span>{mobile}</span>
                {email && (
                  <span className="text-xs text-gray-500">{email}</span>
                )}
              </div>
            )}
            {!mobile && email && (
              <span>{email}</span>
            )}
            {!mobile && !email && (
              <span className="text-gray-400">No contact info</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('is_banned', {
      header: 'Status',
      cell: (info) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          BANNED
        </span>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Banned Since',
      cell: (info) => (
        <div className="text-sm text-gray-900">
          {formatDateTime(info.getValue())}
        </div>
      ),
    }),
  ];

  // Create table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    dispatch(fetchBannedUsers());
  }, [dispatch]);

  if (bannedUsersLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading banned users...</p>
        </div>
      </div>
    );
  }

  if (bannedUsersError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
        <div className="text-center text-red-600">
          <p>Failed to load banned users</p>
          <p className="text-sm mt-2">{bannedUsersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Banned Users</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Total Banned: <span className="font-semibold text-red-600">{bannedUsers?.count || 0}</span>
          </span>
        </div>
      </div>

      {!bannedUsers?.results || bannedUsers.results.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2 text-6xl">
            🚫
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Banned Users</h3>
          <p className="text-gray-500">There are currently no banned users</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="mt-6">
            <DataTablePagination table={table} />
          </div>
        </>
      )}
    </div>
  );
};

// Helper function to format date time
function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  } catch (error) {
    return dateString;
  }
}

export default BannedUsersPage;