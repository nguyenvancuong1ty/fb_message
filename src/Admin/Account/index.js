import { SearchOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import LoadingAntd from '~/Loading/Loading.antd';

function AccountPage({ account }) {
    const [data, setData] = useState(account);
    const [loading, setLoading] = useState(true);
    const [filteredInfo, setFilteredInfo] = useState({});
    const typeStyle = (type) => {
        let color = '';
        switch (type) {
            case 'clothes':
                color = 'yellow';
                break;
            case 'candy':
                color = 'pink';
                break;
            case 'cake':
                color = 'skyblue';
                break;
            case 'houseware':
                color = '#b7eb8f';
                break;
            case 'smart device':
                color = '#adc6ff';
                break;
            default:
                color = '#b7eb8f';
                break;
        }
        return { marginBottom: 0, background: color };
    };
    useEffect(() => {
        const settingData = () => {
            const newData = account.map((item) => {
                return {
                    key: item.Id,
                    Id: item.Id,
                    name: item.fullName,
                    age: item.age,
                    username: item.username,
                    email: item.email || '',
                    type: item.type_account,
                    active: `${item.active}`,
                };
            });
            setData(newData);
        };
        settingData();
    }, [account]);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);
    const columns = [
        {
            title: 'Full Name',
            width: 180,
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            filterIcon: () => (
                <SearchOutlined
                    style={{
                        color: '#1677ff',
                    }}
                />
            ),
        },
        {
            title: 'Tuổi',
            width: 150,
            dataIndex: 'age',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 150,
        },
        {
            title: 'Kiểu',
            dataIndex: 'type',
            width: 150,
            filteredValue: filteredInfo.type || null,
            onFilter: (value, record) => record.type.includes(value),
            ellipsis: true,
            filters: [
                {
                    text: 'customer',
                    value: 'customer',
                },
                {
                    text: 'shipper',
                    value: 'shipper',
                },
                {
                    text: 'admin',
                    value: 'admin',
                },
            ],
        },
        {
            title: 'active',
            dataIndex: 'active',
            width: 150,
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 170,
            render: (key) => (
                <>
                    <Button
                        onClick={() => {
                            alert(key.Id);
                        }}
                    >
                        Chi tiết
                    </Button>{' '}
                    <Button danger>Xóa</Button>
                </>
            ),
        },
    ];
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
    };
    return (
        <div className="admin__wrap--content">
            <Container>
                {loading ? (
                    <LoadingAntd subClass="subLoading" foreignClass="foreignClass" />
                ) : (
                    <Table
                        onChange={handleChange}
                        columns={columns}
                        dataSource={data}
                        scroll={{
                            x: 1600,
                            y: 800,
                        }}
                    />
                )}
            </Container>
        </div>
    );
}

export default AccountPage;
