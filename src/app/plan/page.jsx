"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans } from "@/redux/slices/planSlice";
import { DataTablePagination } from "@/components/layout/Pagination";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const Plan = () => {
  const dispatch = useDispatch();
  
  // Get plans from Redux store
  const { plans, loading, error } = useSelector((state) => state.plans);
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });
 const router = useRouter();

  const handleAddPlan = () => {
    router.push("/plan/add");
  };
  // Mock table object for pagination
  const table = useMemo(
    () => ({
      getState: () => ({
        pagination,
      }),
      setPageIndex: (pageIndex) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
      },
      setPageSize: (pageSize) => {
        setPagination((prev) => ({ ...prev, pageSize, pageIndex: 0 }));
      },
      getPageCount: () => {
        if (!plans?.length) return 1;
        return Math.ceil(plans.length / pagination.pageSize);
      },
      getCanPreviousPage: () => pagination.pageIndex > 0,
      getCanNextPage: () => {
        if (!plans?.length) return false;
        return (pagination.pageIndex + 1) * pagination.pageSize < plans.length;
      },
      previousPage: () => {
        setPagination((prev) => ({
          ...prev,
          pageIndex: Math.max(0, prev.pageIndex - 1),
        }));
      },
      nextPage: () => {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev.pageIndex + 1,
        }));
      },
    }),
    [pagination, plans?.length]
  );
  
  useEffect(() => {
    dispatch(fetchPlans({ page: 1, limit: 10 }))
      .unwrap()
      .then((res) => {
        console.log("plans fetched successfully:", res);
      })
      .catch((err) => {
        console.error("Failed to fetch plans:", err);
      });
  }, [dispatch]);

  // Function to generate gradient based on plan category
  const getPlanGradient = (categoryName) => {
    const gradients = {
      Welcome: "from-slate-500 to-slate-700",
      Premium: "from-gray-500 to-gray-700",
      Business: "from-zinc-500 to-zinc-700",
      Enterprise: "from-neutral-500 to-neutral-700",
    };
    return gradients[categoryName] || "from-stone-500 to-stone-700";
  };

  // Get paginated plans
  const paginatedPlans = useMemo(() => {
    if (!plans?.length) return [];
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return plans.slice(startIndex, endIndex);
  }, [plans, pagination.pageIndex, pagination.pageSize]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading plans
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Plans Management</h1>
            {plans?.length > 0 && (
              <p className="text-gray-600 mt-2">
                Showing {paginatedPlans.length} of {plans.length} plans
              </p>
            )}
          </div>

          {/* Add Plan Button */}
          <Button variant='default' onClick={handleAddPlan} >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Plan
          </Button>
        </div>

        {/* Plans Cards Grid */}
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {paginatedPlans.map((plan) => (
            <div
                            onClick={() => router.push(`/plan/${plan.id}`)}

              key={plan.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              {/* Plan Header with Gradient */}
              <div
                className={`bg-gradient-to-r ${getPlanGradient(
                  plan.category_name
                )} px-6 py-6 relative`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Plan Icon */}
                   

                    {/* Plan Name and Category */}
                    <h2 className="text-xl font-bold text-white mb-1">
                      {plan.plan_name}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {plan.category_name}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      plan.is_active
                        ? "bg-green-500/20 text-white border border-white/30"
                        : "bg-gray-500/20 text-white border border-white/30"
                    }`}
                  >
                    {plan.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      ₹{plan.final_price}
                    </span>
                    {plan.discount_percentage > 0 && (
                      <span className="text-white/60 text-sm line-through">
                        ₹{parseFloat(plan.base_price).toFixed(0)}
                      </span>
                    )}
                  </div>
                  {plan.discount_percentage > 0 && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-white text-xs font-semibold rounded">
                      {plan.discount_percentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Plan Details */}
              <div className="p-6 space-y-4">
                {/* Coins Package */}
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-semibold">
                        Coins Package
                      </p>
                      <p className="text-sm font-bold text-blue-900">
                        {plan.adjusted_coin_package.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Talktime */}
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-semibold">
                        Talk Time
                      </p>
                      <p className="text-sm font-bold text-green-900">
                        {plan.total_talktime} minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {plan.total_talktime_minutes}
                  </p>
                </div>

               
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!plans || plans.length === 0) && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No plans found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Get started by creating your first subscription plan.
            </p>
            <Button variant="default" >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Plan
            </Button>
          </div>
        )}

        {/* Pagination using DataTablePagination component */}
        {plans && plans.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;