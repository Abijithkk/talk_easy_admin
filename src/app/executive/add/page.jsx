"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerExecutive,
  fetchExecutiveLanguages,
  createExecutiveLanguage,
} from "@/redux/slices/executiveSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function AddExecutive() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { languages, languagesLoading, loading, error } = useSelector(
    (state) => state.executives
  );

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
    status: "active",
    account_number: "",
    ifsc_code: "",
    password: "",
    languages_known: [],
  });

  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [creatingLanguage, setCreatingLanguage] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];
  const statusOptions = ["active", "inactive"];

  useEffect(() => {
    dispatch(fetchExecutiveLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      let errorMessage = "Failed to add executive";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        if (error.message.includes("Object with name=")) {
          errorMessage = "Invalid language selection. Please refresh the page and try again.";
        } else {
          errorMessage = error.message;
        }
      }
    }
  }, [error]);

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

  const handleAddNewLanguage = async () => {
    if (!newLanguage.trim()) {
      toast.error("Please enter a language name");
      return;
    }

    // Check if language already exists
    const existingLanguage = languages.find(
      (lang) => lang.name.toLowerCase() === newLanguage.trim().toLowerCase()
    );

    if (existingLanguage) {
      toast.error("This language already exists");
      return;
    }

    setCreatingLanguage(true);

    try {
      const result = await dispatch(createExecutiveLanguage({ name: newLanguage.trim() })).unwrap();
      
      toast.success("Language added successfully!");
      setNewLanguage("");
      setShowAddLanguage(false);
      
      // Refresh the languages list
      dispatch(fetchExecutiveLanguages());
      
      // Automatically select the newly created language
      if (result && result.id) {
        setFormData({
          ...formData,
          languages_known: [...formData.languages_known, result.id.toString()],
        });
      }
    } catch (error) {
      console.error("Failed to create language:", error);
      let errorMessage = "Failed to add language. Please try again.";
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setCreatingLanguage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.languages_known.length === 0) {
      toast.error("Please select at least one language");
      return;
    }

    if (formData.password.length < 5) {
      toast.error("Password must be at least 5 characters long");
      return;
    }

    // Get language names instead of IDs
    const selectedLanguageNames = formData.languages_known.map(langId => {
      const language = languages.find(lang => lang.id.toString() === langId);
      return language ? language.name : langId;
    });

    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      languages_known: selectedLanguageNames,
      is_verified: 1,
    };

    console.log("Submitting data:", submitData);

    try {
      const result = await dispatch(registerExecutive(submitData)).unwrap();
      
      // Reset form
      setFormData({
        mobile_number: "",
        name: "",
        age: "",
        email_id: "",
        gender: "",
        profession: "",
        skills: "",
        place: "",
        education_qualification: "",
        status: "active",
        account_number: "",
        ifsc_code: "",
        password: "",
        languages_known: [],
      });

      toast.success("Executive added successfully!");
      
    } catch (error) {
      console.error("Failed to add executive:", error);
      
      let errorMessage = "Failed to add executive. Please try again.";
      
      if (error?.message) {
        if (error.message.includes("Object with name=")) {
          errorMessage = "There was an issue with language selection. Please try again.";
        } else if (error.message.includes("already exists")) {
          errorMessage = "An executive with this email or mobile number already exists.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-4 lg:px-4">
      <div className="max-w-8xl">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section with Back Button */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Add Executive
            </h1>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleBack}
            >
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
                  placeholder="Enter mobile number"
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
                  placeholder="Enter a Profession"
                  value={formData.profession}
                  onChange={handleChange}
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
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Languages Known *
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddLanguage(!showAddLanguage)}
                >
                  {showAddLanguage ? "Cancel" : "+ Add New Language"}
                </Button>
              </div>

              {/* Add New Language Input */}
              {showAddLanguage && (
                <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Language
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Enter language name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddNewLanguage}
                      disabled={creatingLanguage || !newLanguage.trim()}
                      variant="default"
                      size="sm"
                    >
                      {creatingLanguage ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>
              )}

              {languagesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading languages...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  {languages && languages.length > 0 ? (
                    languages.map((language) => (
                      <label
                        key={language.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          name="languages_known"
                          value={language.id}
                          checked={formData.languages_known.includes(
                            language.id.toString()
                          )}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {language.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4 text-gray-500">
                      No languages available
                    </div>
                  )}
                </div>
              )}
              {formData.languages_known.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least one language
                </p>
              )}
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

            {/* Status & Password */}
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  required
                  minLength="5"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 5 characters required
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" variant="default" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Adding Executive...</span>
                  </>
                ) : (
                  <span>Add Executive</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}