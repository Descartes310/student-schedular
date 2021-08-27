import React from 'react'
import { Form, Input, Button } from 'antd'
import { SearchOutlined } from "@ant-design/icons"

function SearchFilter ({ changeInput, searchList}) {

    return(
        <Form layout="inline" style={{ marginRight: '20px' }}>
            <Form.Item>
                <Input
                    type="text"
                    placeholder="Enter Tag Name"
                    name="name"
                    onChange={changeInput}
                />
            </Form.Item>

            <Button onClick={searchList} type="primary">
                <SearchOutlined />
            </Button>
        </Form>
    )

}
export default SearchFilter