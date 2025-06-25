/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useAppStateAPI } from "../common/AppStateAPI";
import { ServerAPI } from "../common/ServerAPI";
import { ProjectConfig } from "../common/Constants";
import { Pagination } from "@mui/material";
import SearchInputContainer from "../components/SearchInputContainer";

const AdminDashboard: React.FC = () => {
  const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
  const [dashboardCompaniesCount, setDashboardCompaniesCount] = useState<any>("");
  const [dashboardComaniesList, setDashboardCompaniesList] = useState<any[]>([]);
  const [dashboardClientCount, setDashboardClientCount] = useState<any>("");

  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 5;
  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const getAdminDashboardDetails = (params: any) => {
    addProcessingRequests();
    ServerAPI.getAdminDashboard(params)
      .then((response) => {
        if (response) {
          const responseData = response.data;
          console.log(responseData)
          if (response.data.pagination["total_pages"] !== undefined) {
            setTotalPages(response.data.pagination["total_pages"]);
            setCurrentPage(response.data.pagination["page_number"]);
          }
          setDashboardCompaniesCount(responseData.company_count)
          setDashboardClientCount(responseData.client_count)
          setDashboardCompaniesList(responseData.companies);
        } else {
          setDashboardCompaniesList([]);
        }
      })
      .finally(() => {
        reduceProcessingRequests();
      });
  };


  useEffect(() => {
    getAdminDashboardDetails({
      page_size: pageSize,
      page_number: currentPage,
      search:""
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const sendToBackend = (value: any) => {
    getAdminDashboardDetails({
        page_size: pageSize,
        page_number: currentPage,
        search:value
      });
  };

  return (
    <section className="pt-15 pb-5">
      <div>
        <div className="row pb-3 gap-3">
          <div className="col col-md-6 col-lg-4 col-xl-3 mb-3 mb-md-0">
            <div className="dashboard-cookie-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h2>Companies :</h2>
                  <p>{dashboardCompaniesCount}</p>
                </div>
                <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                  <img
                  alt="company group"
                    src={
                      window.location.origin + "/assets/svg/company-group.svg"
                    }
                    style={{ height: 32, width: 32 }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col col-md-6 col-lg-4 col-xl-3">
            <div className="dashboard-cookie-card">
              <div className="d-flex justify-content-between">
                <div>
                  <h2>Clients :</h2>
                  <p>{dashboardClientCount}</p>
                </div>
                <div className="my-auto px-3 border border-1 py-2 rounded-full bg-white">
                  <img
                  alt="user group"
                    src={window.location.origin + "/assets/svg/user-group.svg"}
                    style={{ height: 32, width: 32 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SearchInputContainer triggerAPICall={sendToBackend} />
        </div>
        <div className="table-container">
          <div className="table-scroll">
            <div className="table-responsive">
              <table className="table">
                <thead className="color-native-blue">
                  <tr>
                    <th style={{ width: "5%" }}>S.no</th>
                    <th>Company Name</th>
                    <th>Client Name</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardComaniesList && dashboardComaniesList?.length > 0 ? (
                    dashboardComaniesList?.map((item: any, index: number) => {
                      return (
                        <tr>
                          <td>
                            {(currentPage - 1) * ProjectConfig.EntriesPerPage +
                              index +
                              1}
                          </td>
                          <td>{item.company_name}</td>
                          <td>{item.user.user_name}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6}>No Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ float: "right" }}>
              <Pagination
                count={totalPages}
                onChange={handlePagination}
                page={currentPage}
                variant="outlined"
                color="primary"
                shape="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
