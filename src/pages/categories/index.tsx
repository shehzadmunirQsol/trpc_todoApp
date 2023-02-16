export default Index
import React, { useCallback, useEffect, useState } from 'react'
import LoginForm from '../../components/LoginForm'
import { useAuthContext } from '../../context/AuthContext'
import { trpc } from '../../utils/trpc'
import {
  Text,
  Box,
  Heading,
  Flex,
  HStack,
  Button,
  useDisclosure,
  useColorModeValue,
  Input,
  IconButton
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import NewTaskModal from '../../components/NewTaskModal'
import { BiMessageRoundedAdd, BiPlus } from 'react-icons/bi'
import DataTable, { createTheme } from 'react-data-table-component'

import type { Categories, NewCategory } from '../../types'

import { MdAutoDelete, MdCheck, MdDelete, MdEdit } from 'react-icons/md'
import { useRouter } from 'next/router'
import { IoMdEye } from 'react-icons/io'
import Link from 'next/link'
import SearchBar from '../../components/SearchBar'
import UpdateCategoryModal from '../../components/UpdateCategoriesModal'
createTheme(
  'solarized',
  {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198'
    },
    background: {
      default: '#002b36'
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF'
    },
    divider: {
      default: '#073642'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)
// createTheme('dark', {
//   background: {
//     default: 'transparent'
//   }
// })
function CategoryItem({ task }: any) {
  return (
    <Box
      flex="1"
      textAlign="left"
      fontSize="1.1rem"
      justifyContent="space-between"
    >
      <Flex gap="2" py={2} alignItems="center" justifyContent="space-between">
        <Text>{task.name}</Text>

        {task.assignedToId == task.createdBy ? (
          <Text fontSize={14}>Assign To : You</Text>
        ) : (
          <Text fontSize={14}>Assign To : ({task.AsigneeName})</Text>
        )}
      </Flex>
    </Box>
  )
}

function Index() {
  const { user } = useAuthContext()
  const path = useRouter()
  const data = path.query.data?.toString()
  const getCategories = trpc.useQuery(['categrories.getCategories'])
  const getUsers = trpc.useQuery(['users.getUsers'])
  const [search, setSearch] = useState<string>('')
  const HandleColorModeChange = useColorModeValue('gray.600', 'gray.400')
  const utils = trpc.useContext()

  const deleteCategories = trpc.useMutation('categrories.deleteCategories')
  const updateTask = trpc.useMutation('tasks.updateTask')
  const createTaskRequest = trpc.useMutation('categrories.createCategory')
  const updateCategoryRequest = trpc.useMutation('categrories.updateCategory')
  const [taskRequests, setTaskRequests] = useState<any>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // this updates the UI when the userQuery data is first loaded.
  useEffect(() => {
    if (getCategories.isFetching) setTaskRequests(undefined)
    if (getCategories.isFetched) setTaskRequests(getCategories?.data)
  }, [getCategories.data, getCategories.isFetched, getCategories.isFetching])

  const handleCheck = async (task: any) => {
    await updateTask.mutateAsync(
      { ...task },
      {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getTasks'])
        }
      }
    )
  }
  const handleDelete = async (id: any) => {
    await deleteCategories.mutateAsync(
      { id: id },
      {
        onSuccess: () => {
          utils.invalidateQueries(['categrories.getCategories'])
        }
      }
    )
  }
  const [updateData, setUpdateData] = useState({
    uid: '',
    category_name: '',
    category_desc: '',
    status: 1
  })
  const handleUpdate = (row: any) => {
    setUpdateData({
      uid: row.id,
      category_name: row.category_name,
      category_desc: row.category_desc,
      status: row.status
    })
    onOpen()
  }
  console.log(updateData, 'updateData')
  // const handleCreateJuiceRequest = useCallback(
  //   async (data: NewTask) => {
  //     await createTaskRequest.mutateAsync(data, {
  //       onSuccess: () => {
  //         utils.invalidateQueries(['tasks.getTasks'])
  //       }
  //     })
  //   },
  //   [createTaskRequest, utils]
  // )
  const handleCreateCategories = useCallback(
    async (data: NewCategory) => {
      await createTaskRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['categrories.getCategories'])
        }
      })
    },
    [createTaskRequest, utils]
  )
  const handleUpdateCategories = useCallback(
    async (data: Categories) => {
      await updateCategoryRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['categrories.getCategories'])
        }
      })
    },
    [createTaskRequest, utils]
  )

  const columns = [
    {
      name: 'Category Name',
      selector: (row: any) => row?.category_name
    },
    {
      name: 'Category Description',
      selector: (row: any) => row?.category_desc
    },
    {
      name: 'Status',
      selector: (row: any) => row?.status
    },
    {
      name: 'Created By',
      selector: (row: any) => row?.CreatorName
    },
    {
      name: 'Created On',
      selector: (row: any) => {
        return <>{row?.created_at.toLocaleString()}</>
      }
    },
    {
      name: 'Action',
      selector: (row: any) => {
        return (
          <>
            {user.auth == 'admin' ? (
              <>
                <IconButton
                  variant="ghost"
                  aria-label="more information"
                  icon={<MdDelete />}
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                />
                <IconButton
                  variant="ghost"
                  aria-label="more information"
                  icon={<MdEdit />}
                  size="sm"
                  onClick={() => handleUpdate(row)}
                />
              </>
            ) : (
              <></>
            )}
          </>
        )
      }
    }
  ]

  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false)
  const filteredItems = getCategories?.data?.filter(
    item =>
      item?.category_name &&
      item?.category_name.toLowerCase().includes(filterText.toLowerCase())
  )

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    return (
      <Input
        type="text"
        onChange={e => setFilterText(e.target.value)}
        w={'150px'}
        color={'black'}
        placeholder="Search"
        border="1px"
        borderColor="gray.200"
        // onClear={handleClear}
        value={filterText}
      />
    )
  }, [filterText, resetPaginationToggle])

  if (!user.firstName) return <LoginForm />
  return (
    <Box maxW="container.lg">
      <UpdateCategoryModal
        isOpen={isOpen}
        onClose={onClose}
        uid={updateData.uid}
        category_name={updateData.category_name}
        category_desc={updateData.category_desc}
        status={updateData.status}
        handleCreateCategories={handleCreateCategories}
        handleUpdateCategories={handleUpdateCategories}
      />

      <HStack justify="space-between" mb={4}>
        <Heading>Catergoires</Heading>
        <Button
          leftIcon={<BiPlus />}
          variant="outline"
          colorScheme="green"
          onClick={() => {
            handleUpdate({
              uid: '',
              category_name: '',
              category_desc: '',
              status: 1
            })
          }}
        >
          Add New Category
        </Button>
      </HStack>

      <DataTable
        // style={{ borderRadius: '25px' }}
        title="Categories"
        columns={columns}
        theme="solarized"
        data={filteredItems || []}
        pagination
        dense
        selectableRows
        paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />

      {/* {getCategories.data &&
        liveSearch()?.map((task: any) => {
          return (
            <>
              <Flex
                key={task.id}
                gap="2"
                py={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {user.auth == 'admin' || task.createdBy == user.id ? (
                  <IconButton
                    variant="ghost"
                    aria-label="more information"
                    icon={<MdDelete />}
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  />
                ) : (
                  <></>
                )}
              </Flex>
              <Divider />
            </>
          )
        })} */}
    </Box>
  )
}
