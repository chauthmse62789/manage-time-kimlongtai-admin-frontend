import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Button from '@material-ui/core/Button';
import downloadFill from '@iconify/icons-eva/download-fill';
import { Icon } from '@iconify/react';
export const ExportCSV = ({csvData, fileName}) => {

    const calculateSumWorkingTime = (begin, breaktime, doneBreaktime,breaktime2, doneBreaktime2,breaktime3, doneBreaktime3,breaktime4, doneBreaktime4, endtime) => {

  

      //BeginTime

    var hoursBegin = parseInt(begin.slice(0, 2));
    var minsBegin = parseInt(begin.slice(3, 5));
    var convertBeginAllMins = hoursBegin*60 + minsBegin;




// Breaktime - DoneBreaktime
    var hoursBreaktime = parseInt(breaktime.slice(0, 2));
    var minsBreaktime = parseInt(breaktime.slice(3, 5));
    var convertBreaktimeAllMins = hoursBreaktime*60 + minsBreaktime;







    var hoursDoneBreaktime= parseInt(doneBreaktime.slice(0, 2));
    var minsDoneBreaktime= parseInt(doneBreaktime.slice(3, 5));
    var convertDoneBreaktime = hoursDoneBreaktime*60 + minsDoneBreaktime;
    
   
    

// Breaktime2 - DoneBreaktime2


    var hoursBreaktime2 = parseInt(breaktime2.slice(0, 2));
    var minsBreaktime2 = parseInt(breaktime2.slice(3, 5));
    var convertBreaktime2AllMins = hoursBreaktime2*60 + minsBreaktime2;




    var hoursDoneBreaktime2= parseInt(doneBreaktime2.slice(0, 2));
    var minsDoneBreaktime2= parseInt(doneBreaktime2.slice(3, 5));
    var convertDoneBreaktime2 = hoursDoneBreaktime2*60 + minsDoneBreaktime2;


// Breaktime3 - DoneBreaktime3


    var hoursBreaktime3 = parseInt(breaktime3.slice(0, 2));
    var minsBreaktime3 = parseInt(breaktime3.slice(3, 5));
    var convertBreaktime3AllMins = hoursBreaktime3*60 + minsBreaktime3;




    var hoursDoneBreaktime3= parseInt(doneBreaktime3.slice(0, 2));
    var minsDoneBreaktime3= parseInt(doneBreaktime3.slice(3, 5));
    var convertDoneBreaktime3 = hoursDoneBreaktime3*60 + minsDoneBreaktime3;



// Breaktime4 - DoneBreaktime4


var hoursBreaktime4 = parseInt(breaktime4.slice(0, 2));
var minsBreaktime4 = parseInt(breaktime4.slice(3, 5));
var convertBreaktime4AllMins = hoursBreaktime4*60 + minsBreaktime4;




var hoursDoneBreaktime4= parseInt(doneBreaktime4.slice(0, 2));
var minsDoneBreaktime4= parseInt(doneBreaktime4.slice(3, 5));
var convertDoneBreaktime4 = hoursDoneBreaktime4*60 + minsDoneBreaktime4;





// Endtime

    var hoursEndtime = parseInt(endtime.slice(0, 2));
    var minsEndtime = parseInt(endtime.slice(3, 5));
    var convertEndtimeAllMins = hoursEndtime*60 + minsEndtime;
    
    
     
      
       
       
    var   sumAllMins = (convertEndtimeAllMins - convertBeginAllMins) - (convertDoneBreaktime - convertBreaktimeAllMins) -(convertDoneBreaktime2 - convertBreaktime2AllMins) -(convertDoneBreaktime3 - convertBreaktime3AllMins) -(convertDoneBreaktime4 - convertBreaktime4AllMins);
        
      var customHours = Math.floor(sumAllMins/60);
      var customMins = sumAllMins %60
    var converMinsToHours = customMins/60


      var result = customHours  + converMinsToHours
    
        return result;
    
    
      }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData.map((item,stt=0)=>{

            return ( { 'STT':++stt, 'HỌ TÊN':item.users_permissions_user.lastName +' ' +item.users_permissions_user.firstName, 'NGÀY':item.date,'TRẠNG THÁI NHÂN VIÊN':item.users_permissions_user.blocked===false ?'Còn Hiệu Lực':'Tạm Khóa', 'VÀO CA':item.beginTime, 'KẾT CA':item.endTime, 'TRẠNG THÁI':item.status_work.nameStatusWork,'SỐ LẦN NGHỈ':item.numberOfBreaks,'SỐ GIỜ LÀM VIỆC':calculateSumWorkingTime(item.beginTime,item.breaktime,item.doneBreaktime,item.breaktime2,item.doneBreaktime2,item.breaktime3,item.doneBreaktime3,item.breaktime4,item.doneBreaktime4,item.endTime) })

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
            exportToCSV(csvData,fileName)}>Export</Button>
       
        
    )
}