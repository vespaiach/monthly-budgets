import { InfiniteLoader, WindowScroller, AutoSizer, Table, Column } from 'react-virtualized';
import clsx from 'clsx';
import { styled } from '@material-ui/core/styles';
import { TableSortLabel, makeStyles, TableCell, TableRow, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import ClipboardEditIcon from '../components/Icons/ClipboardEdit';
import CloseBoxIcon from '../components/Icons/CloseBox';

const Row = styled(TableRow)(({ theme }) => ({
    display: 'flex',
    '& > .ReactVirtualized__Table__rowColumn:first-child .MuiTableCell-root': {
        paddingLeft: theme.spacing(1),
    },
    '& > .ReactVirtualized__Table__rowColumn:last-child .MuiTableCell-root': {
        paddingRight: theme.spacing(1),
    },
}));

const Button = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.disabled,
}));

function cellDataGetter({ dataKey, rowData }) {
    if (!rowData || rowData === 'loading') {
        return 'loading';
    }
    return rowData[dataKey];
}

function cellRenderer({ cellData, columnData, rowData, rowIndex, columnIndex }) {
    const handleEdit = () => {
        if (columnData.onEdit) {
            columnData.onEdit({ rowData, rowIndex, columnIndex });
        }
    };
    const handleDelete = () => {
        if (columnData.onDelete) {
            columnData.onDelete({ rowData, rowIndex, columnIndex });
        }
    };
    let cellContent = null;
    if (cellData === 'loading') {
        cellContent = <Skeleton variant="text" animation="wave" width={columnData.width} />;
    } else if (columnData.dataKey === '2_buttons') {
        cellContent = (
            <>
                <Button
                    size="small"
                    edge="end"
                    title="Delete Transaction"
                    onClick={handleDelete}
                    style={{ marginLeft: 8 }}
                >
                    <CloseBoxIcon title="Delete Transaction" />
                </Button>
                <Button size="small" title="Edit Transaction" onClick={handleEdit}>
                    <ClipboardEditIcon title="Edit Transaction" />
                </Button>
            </>
        );
    } else if (columnData.format) {
        cellContent = columnData.format(cellData, columnData);
    } else {
        cellContent = cellData;
    }

    return (
        <TableCell
            component="div"
            variant="body"
            align={columnData.align}
            style={{ height: columnData.rowHeight }}
            className={columnData.cellCssClass}
        >
            {cellContent}
        </TableCell>
    );
}

function headerRenderer({ label, columnData }) {
    return (
        <TableCell
            component="div"
            variant="head"
            style={{ height: columnData.headerHeight }}
            align={columnData.align}
            className={columnData.headerCssClass}
        >
            {columnData.direction ? (
                <TableSortLabel direction={columnData.direction} active>
                    {label}
                </TableSortLabel>
            ) : (
                <span>{label}</span>
            )}
        </TableCell>
    );
}

function headerRowRenderer(props) {
    const { className, columns, style } = props;
    return (
        <div className={clsx(className, 'sticky-table-header')} role="row" style={style}>
            {columns}
        </div>
    );
}

function rowRenderer(props) {
    const { columns, key, style } = props;
    return (
        <Row key={key} component="div" style={style}>
            {columns}
        </Row>
    );
}

const useStyles = makeStyles((theme) => ({
    table: {
        '& .ReactVirtualized__Table__headerRow': {
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            position: 'sticky',
            top: (props) => props,
            zIndex: 101,
            '& .ReactVirtualized__Table__headerColumn': {
                '&:first-child .MuiTableCell-root': {
                    paddingLeft: theme.spacing(1),
                },
                '&:last-child .MuiTableCell-root': {
                    paddingRight: theme.spacing(1),
                },
                '& .MuiTableCell-root': {
                    display: 'flex',
                    alignItems: 'center',
                },
            },
            '& .MuiTableCell-head': {
                color: 'white',
                border: 'none',
            },
        },
    },
    cell: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function VirtualTable({
    offsetTop = 68,
    totalRows,
    rows,
    loaderRef,
    onLoadMore,
    headerHeight,
    rowHeight,
    columns,
    onEdit,
    onDelete,
}) {
    const classes = useStyles(offsetTop);
    const isRowLoaded = (index) => rows[index] !== undefined && rows[index] !== null && rows[index] !== 'loading';

    return (
        <AutoSizer disableHeight>
            {({ width }) => (
                <InfiniteLoader
                    ref={loaderRef}
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={onLoadMore}
                    rowCount={totalRows}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <WindowScroller>
                            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                                <Table
                                    autoHeight
                                    isScrolling={isScrolling}
                                    scrollTop={scrollTop}
                                    onScroll={onChildScroll}
                                    onRowsRendered={onRowsRendered}
                                    height={height}
                                    headerHeight={headerHeight}
                                    rowHeight={rowHeight}
                                    width={width}
                                    rowCount={totalRows}
                                    rowGetter={({ index }) => rows[index]}
                                    rowRenderer={rowRenderer}
                                    headerRowRenderer={headerRowRenderer}
                                    className={classes.table}
                                >
                                    {columns.map((column) => {
                                        const realWidth = (width * column.width) / 100;
                                        return (
                                            <Column
                                                className={classes.row}
                                                columnData={{
                                                    ...column,
                                                    headerCssClass: classes.header,
                                                    cellCssClass: classes.cell,
                                                    width: realWidth - 12,
                                                    onEdit,
                                                    onDelete,
                                                }}
                                                label={column.label}
                                                key={column.dataKey}
                                                dataKey={column.dataKey}
                                                width={realWidth}
                                                cellDataGetter={cellDataGetter}
                                                headerRenderer={headerRenderer}
                                                cellRenderer={cellRenderer}
                                            />
                                        );
                                    })}
                                </Table>
                            )}
                        </WindowScroller>
                    )}
                </InfiniteLoader>
            )}
        </AutoSizer>
    );
}

export default VirtualTable;
