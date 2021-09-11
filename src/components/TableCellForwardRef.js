import React, { forwardRef } from "react";
import { TableCell } from '@material-ui/core';


      
      
const TableCellForwardRef = (props, ref) => <TableCell ref={ref}>{props.dataInfo} </TableCell> ;
export default forwardRef(TableCellForwardRef);