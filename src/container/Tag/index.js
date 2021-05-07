import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom'
import { Table, PageHeader,Button,Spin } from 'antd';
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined, PlusOutlined } from "@ant-design/icons"
import {getTags,getTagByDate, enableTags, disableTags} from '../../services/Student'
import SearchFilter from '../../components/Tag/SearchFilter'

export default function TagsList() {

    const history = useHistory();
    const [tagList, setTagList] = useState();

    const [sortingName, setSortingName] = useState("name");
    const [sortingType, setSortingType] = useState("desc");
    const [selectedRow, setSelectedRow] = useState([]);

    const [tableProps, setTableProps] = useState({
        totalCount: 0,
        pageIndex: 0,
        pageSize: 30,
    });

    const [search, setSearch] = useState({
        name: "",
        createDate: "",
    })

    const [loading, setLoading] = useState(false);
    const rowSelection = {
        selectedRow,
        onChange: (selectedrow, records) => {
            console.log('selectedRowKeys changed: ', records);
            setSelectedRow(records);
        }
    };

    const columns = [
        {
            title: <div><span>Name </span>
                {sortingName === "name" && sortingType === "asc" && <VerticalAlignBottomOutlined />}
                {sortingName === "name" && sortingType === "desc" && <VerticalAlignTopOutlined />}
                {sortingName === "name" && sortingType === "" && ""}
            </div>,
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setSortingName("name");
                        if (sortingType == "") { setSortingType("asc") }
                        else if (sortingType == "asc") { setSortingType("desc") }
                        else if (sortingType == "desc") { setSortingType("asc"); setSortingName("name"); }
                    }
                };
            },
            render: (record) => {
                return (
                    <div>
                        {record.name}
                    </div>
                )
            },
            key: 'name',
            fixed: 'left',
        },
        {
            title: <div><span>Create Date </span></div>,
            render: (record) => {
                let s = record.createDate;
                let date = (new Date(s)).toLocaleDateString();
                let sTime= ((new Date(s)).toLocaleTimeString()).split(':');

                let sst= sTime[0]+':'+sTime[1];
                
                return (
                    <span>
                        {date +" "+ sst}
                    </span>
                )
            },
            key: 'createDate',
        },
        {
            title: <div><span>Enabled </span></div>,
            render: (record) => {

                if(record.enabled){
                    return (
                    <span>true</span>)
                } else{
                    return(
                        <span>false</span>
                    )
                }
                
            },
            key: 'enabled',
        }/* ,
        {
            title: <div><span>Action </span>
            </div>,
            render: (record) => {
                return (
                    <div id="edit" onClick={(e) => { e.stopPropagation(); history.push(`/tag/${record.id}/update`, { schedule: record }) }}><EditOutlined id="editIcon" style={{ fontSize: 20, marginLeft: 10, color: '#1890FF' }} /></div>
                )
            },
            key: 'action',
        } */
    ]

    const handleTableChange = (pagination) => {
        setTableProps({
            ...tableProps,
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
        });
        setLoading(true);
        setTagList([]);
    };

    useEffect(() => {
        getListView();
    }, [sortingType, sortingName, tableProps.pageIndex]);

    const getListView = () => {
        if (search.name === "" && search.createDate === "") {
            getTags(tableProps.pageIndex, tableProps.pageSize, sortingName, sortingType).then(data =>{
                if(data){
                    if (data.content) {
                        console.log(data.content);
                        setTagList([...new Map(data.content.map(item => [item['id'], item])).values()])
                        setTableProps({
                            ...tableProps,
                            totalCount: data.totalCount,
                            pageSize: 30,
                        });
                    }
                }else{
                    setTagList([])
                    setTableProps({
                        ...tableProps,
                        totalCount: 0,
                        pageSize: 30,
                    });
                }
                setLoading(false);
            })
        }else {
            getTagByDate(tableProps.pageIndex, tableProps.pageSize, sortingName, sortingType, search.name, localStorage.getItem('createDate')).then(data=>{
                if(data){
                    if (data.content) {
                        console.log(data.content);
                        setTagList([...new Map(data.content.map(item => [item['id'], item])).values()])
                        setTableProps({
                            ...tableProps,
                            totalCount: data.totalCount,
                            pageSize: 30,
                        });
                    }
                }else{
                    setTagList([])
                    setTableProps({
                        ...tableProps,
                        totalCount: 0,
                        pageSize: 30,
                    });
                }
                setLoading(false);
            })
        }
    }

    const handleDisabled = ()=>{

        let tagsToEnable=[]
        let tagsToDisable=[]

        selectedRow.forEach(tag => {
            if(tag.enabled == true){
                tagsToDisable.push(tag.id)
            }else{
                tagsToEnable.push(tag.id)
            }
        });
        console.log("Tags to enable ===>", tagsToEnable);
        console.log("Tags to disable ===>", tagsToDisable);
        if(tagsToEnable.length > 0){
            enableTags(tagsToEnable).then(res=>{
                console.log("done")
            }).finally(() => {
                history.push(`/tagList`)
                setSelectedRow([])
            });
        }
        if(tagsToDisable.length > 0){
            disableTags(tagsToDisable).then(res=>{
                console.log("done")
                history.push(`/tagList`)
            }).finally(() => {
                history.push(`/tagList`)
                setSelectedRow([])
            });
        }
    }

    const searchList = () => {
        getListView();
    }

    const changeSearch = (e) => {
        const { name, value,type } = e.target;
        if (type === "date") {
            const date = new Date(value)
            const toDurationStr = `${(date.getMonth()+1).toString().padStart(2, '0')}/${(date.getDate()).toString().padStart(2, '0')}/${date.getFullYear()} ${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}:00 -0500`
            localStorage.setItem(`createDate`, toDurationStr)
        } 
        setSearch({ ...search, [name]: value });
    }

    return (
        <React.Fragment>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Tags</p>}
                extra={[
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flex: 1 }}>
                        <SearchFilter 
                            changeInput={changeSearch}
                            searchList={searchList}
                        />
                    </div>
                    {
                       (selectedRow.length == 0) ? 
                        (
                        <span></span>
                        ) 
                        :
                       (
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', position:'absolute', right:'120px' }}>
                                <Button key='3' type="primary" size="medium" onClick={handleDisabled}>
                                    Enable/Disable
                                </Button>
                            </div>
                       ) 
                    }
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', position:'absolute', right:'40px'}}>
                        <Button key='3' size="medium" type="primary" onClick={() => history.push('/tag/add')}>
                            <PlusOutlined />
                        </Button>
                    </div>
                </div>
                {
                    !tagList ? 
                        <Spin className="loading-table" /> 
                        :
                        <Table
                        className="table-padding"
                        columns={columns}
                        style={{ marginTop: '30px' }}
                        loading={loading}
                        dataSource={tagList}
                        onChange={handleTableChange}
                        pagination={{
                            total: tableProps.totalCount,
                            pageSize: tableProps.pageSize,
                            showTotal: (total, range) => `${range[0]}-${range[1]} out of ${total}`,
                        }}
                        rowSelection={rowSelection}
                        rowKey="id"
                    />
                }
                
            </PageHeader>
        </React.Fragment>
    )
}