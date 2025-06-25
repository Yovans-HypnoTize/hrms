import { useLocation } from "react-router";
import { useAppStateAPI } from "../../common/AppStateAPI";
import { ServerAPI } from "../../common/ServerAPI";
import { PageLinks } from "../../common/Constants";
import toast from "react-hot-toast";


const ListButtonDownloadEmployeeTemplate: React.FC = () => {

    const { addProcessingRequests, reduceProcessingRequests } = useAppStateAPI();
    const location = useLocation();
    const downloadEmployeeTemplate = () => {
        const currentPage = location.pathname;
        addProcessingRequests();
        const downloadFunction = location.pathname === PageLinks.EMPLOYER_ATTENDANCE ? ServerAPI.downloadAttendanceExcelTemplate : ServerAPI.downloadEmployeeExcelTemplate;
        downloadFunction().then((response:any) => {
            console.log('Data', response);
            toast.success("File downloaded successfully")
            // const link = document.createElement("a");
            // link.target = "_blank";
            // link.download = "employee_column_names.xlsx"
            // link.href = URL.createObjectURL(
            //     new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            //   );
            //   link.click();
            // if (response && response['message']) {
            //     toast.success(response['message']);
            //     // reloadData();
            // } else if (response && response['message']) {
            //     toast.error(response['message']);
            // }
        }).catch(error => {
            console.log(error)
            toast.error("Unable to download file")
           }).finally(() => {
            reduceProcessingRequests();
        });
    }

    return (
        <div>
            <a href="#" onClick={downloadEmployeeTemplate}> <img src={window.location.origin + "/assets/images/excel-icon.png"} alt="" style={{ width: "25px", height: "25px", margin: "10px 0" }} /> </a>
        </div>
    )
}
export default ListButtonDownloadEmployeeTemplate;