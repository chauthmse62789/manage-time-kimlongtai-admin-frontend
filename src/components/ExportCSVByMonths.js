import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Button from '@material-ui/core/Button';
import downloadFill from '@iconify/icons-eva/download-fill';
import { Icon } from '@iconify/react';
export const ExportCSVByMonths = ({csvData, fileName}) => {

    const formatDateFrame = (date) => {
        var d = new Date(date);
        var n = d.toLocaleDateString("vi-VN");
    
        return n
      }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData.map((item,stt=0)=>{

            return ( { 'STT':++stt, 'HỌ TÊN':item.users_permissions_user.lastName +' ' +item.users_permissions_user.firstName,'TRẠNG THÁI NHÂN VIÊN':item.users_permissions_user.blocked===false ?'Còn Hiệu Lực':'Tạm Khóa','TỪ NGÀY':formatDateFrame(item.toDate),'ĐẾN NGÀY':formatDateFrame(item.fromDate),'SỐ NGÀY LÀM VIỆC':item.sumNumberOfWorks,'TỔNG THỜI GIAN NGHỈ':parseFloat(item.sumAllTimeBreaks).toFixed(2),'TỔNG THỜI GIAN LÀM VIỆC':parseFloat(item.sumAllTimeWork).toFixed(2) })

        }));
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button

             style={{height:55}}
            variant="contained"
            to="#"
            startIcon={<Icon icon={downloadFill} />}
        onClick={(e) => 
            exportToCSV(csvData,fileName)}>Xuất</Button>
       
        
    )
}