import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import { getSubjects } from '../../services/Teacher';
import React, { useEffect, useState } from 'react';
import { Table, PageHeader, Button, Spin } from 'antd';
import SearchFilter from '../../components/Tag/SearchFilter';
import { VerticalAlignBottomOutlined, VerticalAlignTopOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";

export default function SubjectsList() {

    const history = useHistory();
    const [subjectList, setSubjectList] = useState();

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
            title: <div><span>Language </span>
                {sortingName === "language" && sortingType === "asc" && <VerticalAlignBottomOutlined />}
                {sortingName === "language" && sortingType === "desc" && <VerticalAlignTopOutlined />}
                {sortingName === "language" && sortingType === "" && ""}
            </div>,
            onHeaderCell: (column) => {
                return {
                    onClick: () => {
                        setSortingName("language");
                        if (sortingType === "") { setSortingType("asc") }
                        else if (sortingType === "asc") { setSortingType("desc") }
                        else if (sortingType === "desc") { setSortingType("asc"); setSortingName("language"); }
                    }
                };
            },
            render: (record) => {
                return (
                    <div>
                        {record.language}
                    </div>
                )
            },
            key: 'language',
            fixed: 'left',
        },
        {
            title: <div><span>Create Date </span></div>,
            render: (record) => {
                let s = record.createDate;
                let date = (new Date(s)).toLocaleDateString();
                let sTime = ((new Date(s)).toLocaleTimeString()).split(':');

                let sst = sTime[0] + ':' + sTime[1];

                return (
                    <span>
                        {date + " " + sst}
                    </span>
                )
            },
            key: 'createDate',
        },
        {
            title: <div><span>Action </span>
            </div>,
            render: (record) => {
                return (
                    <div id="edit" onClick={(e) => { e.stopPropagation(); history.push(`/subjects/${record.id}/update`, { subject: record }) }}><EditOutlined id="editIcon" style={{ fontSize: 20, marginLeft: 10, color: '#1890FF' }} /></div>
                )
            },
            key: 'action',
        }
    ]

    const handleTableChange = (pagination) => {
        setTableProps({
            ...tableProps,
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
        });
        setLoading(true);
        setSubjectList([]);
    };

    useEffect(() => {
        getListView();
    }, [sortingType, sortingName, tableProps.pageIndex]);

    const getListView = (name = '') => {
        getSubjects(tableProps.pageIndex, tableProps.pageSize, sortingName, sortingType, name).then(data => {
            if (data) {
                if (data.content) {
                    setSubjectList([...new Map(data.content.map(item => [item['id'], item])).values()])
                    setTableProps({
                        ...tableProps,
                        totalCount: data.totalCount,
                        pageSize: 30,
                    });
                }
            } else {
                setSubjectList([])
                setTableProps({
                    ...tableProps,
                    totalCount: 0,
                    pageSize: 30,
                });
            }
            setLoading(false);
        })
    }

    const searchList = () => {
        getListView();
    }

    const changeSearch = (e) => {
        const { name, value } = e.target;
        setSearch({ ...search, [name]: value });
        getListView(value);
    }

    return (
        <React.Fragment>
            <PageHeader
                ghost={false}
                title={<p style={{ fontSize: '3em', textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Subjects</p>}
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
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', position: 'absolute', right: '40px' }}>
                        <Button key='3' size="medium" type="primary" onClick={() => history.push('/subjects/add')}>
                            <PlusOutlined />
                        </Button>
                    </div>
                </div>
                {
                    !subjectList ?
                        <Spin className="loading-table" />
                        :
                        <Table
                            className="table-padding"
                            columns={columns}
                            style={{ marginTop: '30px' }}
                            loading={loading}
                            dataSource={subjectList}
                            onChange={handleTableChange}
                            pagination={{
                                total: tableProps.totalCount,
                                pageSize: tableProps.pageSize,
                                showTotal: (total, range) => `${range[0]}-${range[1]} out of ${total}`,
                            }}
                            rowKey="id"
                        />
                }

            </PageHeader>
        </React.Fragment>
    )
}
