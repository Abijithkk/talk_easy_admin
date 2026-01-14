"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExecutiveById,
  updateExecutive,
  fetchExecutiveLanguages,
  clearCurrentExecutive,
  clearCurrentExecutiveError,
  clearUpdateError,
  clearUpdateSuccess,
} from "@/redux/slices/executiveSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";

export default function EditExecutive() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const executiveId = params.id;

  const {
    currentExecutive,
    languages,
    languagesLoading,
    currentExecutiveLoading,
    updateLoading,
    error,
    currentExecutiveError,
    updateError,
    updateSuccess,
  } = useSelector((state) => state.executives);

  const [formData, setFormData] = useState({
    mobile_number: "",
    name: "",
    age: "",
    email_id: "",
    gender: "",
    profession: "",
    skills: "",
    place: "",
    education_qualification: "",
    amount_per_min: "",
    status: "active",
    account_number: "",
    ifsc_code: "",
    languages_known: [],
  });

  const genderOptions = ["Male", "Female", "Other"];
  const statusOptions = ["active", "inactive"];


  useEffect(() => {
    if (executiveId) {
      dispatch(fetchExecutiveById(executiveId));
    }
    dispatch(fetchExecutiveLanguages());

    // Cleanup function
    return () => {
      dispatch(clearCurrentExecutive());
      dispatch(clearCurrentExecutiveError());
      dispatch(clearUpdateError());
      dispatch(clearUpdateSuccess());
    };
  }, [dispatch, executiveId]);

  // Populate form when executive data is fetched
  useEffect(() => {
    if (currentExecutive) {
      setFormData({
        mobile_number: currentExecutive.mobile_number || "",
        name: currentExecutive.name || "",
        age: currentExecutive.age?.toString() || "",
        email_id: currentExecutive.email_id || "",
        gender: currentExecutive.gender || "",
        profession: currentExecutive.profession || "",
        skills: currentExecutive.skills || "",
        place: currentExecutive.place || "",
        education_qualification: currentExecutive.education_qualification || "",
        amount_per_min: currentExecutive.stats?.amount_per_min  || "",
        status: currentExecutive.status || "active",
        account_number: currentExecutive.account_number || "",
        ifsc_code: currentExecutive.ifsc_code || "",
        languages_known: currentExecutive.languages_known
          ? currentExecutive.languages_known.map((lang) => lang.toString())
          : [],
      });
    }
  }, [currentExecutive]);

  // Error handling effects
  useEffect(() => {
    if (currentExecutiveError) {
      let errorMessage = "Failed to fetch executive details";

      if (typeof currentExecutiveError === "string") {
        errorMessage = currentExecutiveError;
      } else if (currentExecutiveError?.message) {
        errorMessage = currentExecutiveError.message;
      }

      toast.error(errorMessage);
    }
  }, [currentExecutiveError]);

  useEffect(() => {
    if (updateError) {
      let errorMessage = "Failed to update executive";

      if (typeof updateError === "string") {
        errorMessage = updateError;
      } else if (updateError?.message) {
        if (updateError.message.includes("already exists")) {
          errorMessage =
            "An executive with this email or mobile number already exists.";
        } else {
          errorMessage = updateError.message;
        }
      }

      toast.error(errorMessage);
    }
  }, [updateError]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(updateSuccess);
      // Optionally redirect after successful update
      // router.push('/executives');
    }
  }, [updateSuccess, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const updatedLanguages = checked
        ? [...formData.languages_known, value]
        : formData.languages_known.filter((lang) => lang !== value);

      setFormData({
        ...formData,
        languages_known: updatedLanguages,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();



  // Convert language IDs to names (same as Add form)
  const selectedLanguageNames = formData.languages_known.map(langId => {
    const language = languages.find(lang => lang.id.toString() === langId);
    return language ? language.name : langId;
  });

  // Prepare data for update with proper nesting
  const submitData = {
    ...formData,
    age: parseInt(formData.age),
    stats: {
      amount_per_min: parseFloat(formData.amount_per_min) || 0
    },
    languages_known: selectedLanguageNames, 
  };

  delete submitData.amount_per_min;

  try {
    const result = await dispatch(
      updateExecutive({
        id: executiveId,
        executiveData: submitData,
      })
    ).unwrap();

 
    
  } catch (error) {
    // Enhanced error handling
    if (error.password) {
      // Handle password validation errors from backend
      toast.error(`Password error: ${error.password[0]}`);
    } else if (error.message) {
      // Handle general error messages
      toast.error(error.message);
    } else if (typeof error === 'string') {
      // Handle string errors
      toast.error(error);
    } else {
      // Fallback for unknown errors
      toast.error("Failed to update executive. Please check the form data.");
    }
  }
};

  const handleBack = () => {
    router.back();
  };

  if (currentExecutiveLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading executive details...</p>
        </div>
      </div>
    );
  }

  if (!currentExecutive && !currentExecutiveLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Executive Not Found
          </h2>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-4 lg:px-4">
      <div className="max-w-8xl">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section with Back Button */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Edit Executive</h1>
            <Button type="button" variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile_number"
                  placeholder="+91 9876543210"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email_id"
                  placeholder="john.doe@example.com"
                  value={formData.email_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="28"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profession *
                </label>
                  <input
                  type="text"
                  name="profession"
                  placeholder=""
                  value={formData.profession}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            {/* Location & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="place"
                  placeholder="Bangalore"
                  value={formData.place}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education Qualification *
                </label>
                <input
                  type="text"
                  name="education_qualification"
                  placeholder="MBA in Marketing"
                  value={formData.education_qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills *
              </label>
              <input
                type="text"
                name="skills"
                placeholder="Communication, Negotiation, Sales"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>

            {/* Languages Checkbox Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Languages Known *
              </label>
              {languagesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading languages...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                 {languages.map((language) => (
  <label
    key={language.id}
    className="flex items-center space-x-2 cursor-pointer"
  >
    <input
      type="checkbox"
      name="languages_known"
      value={language.id}
      checked={formData.languages_known.includes(language.id.toString())}
      onChange={handleChange}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">
      {language.name}
    </span>
  </label>
))}
                </div>
              )}
              {formData.languages_known.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least one language
                </p>
              )}
            </div>
                       <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount/min
              </label>
              <input
                type="text"
                name="amount_per_min"
                placeholder=""
                value={formData.amount_per_min}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                required
              />
            </div>


            {/* Bank Details Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bank Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    placeholder="123456789012"
                    value={formData.account_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="ifsc_code"
                    placeholder="HDFC0001234"
                    value={formData.ifsc_code}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

             
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" variant="default" disabled={updateLoading}>
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Updating Executive...</span>
                  </>
                ) : (
                  <span>Update Executive</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
