export default Index
import React, { useCallback, useEffect, useState } from 'react'
import LoginForm from '../../components/LoginForm'
import { useAuthContext } from '../../context/AuthContext'
import { trpc } from '../../utils/trpc'
import {
  Text,
  Select,
  Box,
  Heading,
  Flex,
  Checkbox,
  IconButton,
  Divider,
  HStack,
  Button,
  useDisclosure,
  useColorModeValue,
  Alert,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import NewTaskModal from '../../components/NewTaskModal'
import { BiMessageRoundedAdd, BiPlus } from 'react-icons/bi'

import type {
  JuiceRequest,
  NewJuiceRequest,
  JuiceRequestUpdate,
  User,
  NewTask,
  Task
} from '../../types'

import { MdAutoDelete, MdCheck, MdDelete } from 'react-icons/md'
import { useRouter } from 'next/router'
import { IoMdEye } from 'react-icons/io'
import Link from 'next/link'
import SearchBar from '../../components/SearchBar'
function TaskItem({ task }: any) {
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
  const getTasks = trpc.useQuery([
    'tasks.getTasks',
    {
      assignedToId: user.id,
      status: data ? data : 'pending',
      user_auth: user.auth
    }
  ])
  const getUsers = trpc.useQuery(['users.getUsers'])
  const [search, setSearch] = useState<string>('')
  const HandleColorModeChange = useColorModeValue('gray.600', 'gray.400')
  const utils = trpc.useContext()

  const deleteTask = trpc.useMutation('tasks.deleteTask')
  const updateTask = trpc.useMutation('tasks.updateTask')
  const createTaskRequest = trpc.useMutation('tasks.createTask')
  const [taskRequests, setTaskRequests] = useState<any>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // this updates the UI when the userQuery data is first loaded.
  useEffect(() => {
    if (getTasks.isFetching) setTaskRequests(undefined)
    if (getTasks.isFetched) setTaskRequests(getTasks?.data)
  }, [getTasks.data, getTasks.isFetched, getTasks.isFetching])

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
    await deleteTask.mutateAsync(
      { id: id },
      {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getTasks'])
        }
      }
    )
  }
  const handleCreateJuiceRequest = useCallback(
    async (data: NewTask) => {
      await createTaskRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getTasks'])
        }
      })
    },
    [createTaskRequest, utils]
  )

  const liveSearch = () => {
    return taskRequests?.filter((data: any) => {
      const name = data.name.toLowerCase()
      const description = data.description.toLowerCase()

      const searchWords = search.toLowerCase().split(' ')
      return searchWords.every(word => {
        return name.includes(word) || description.includes(word)
      })
    })
  }
  if (!user.firstName) return <LoginForm />
  return (
    <Box maxW="container.lg">
      <NewTaskModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateJuiceRequest}
      />

      <HStack justify="space-between" mb={4}>
        <Heading>Catergoires</Heading>
        <Button
          leftIcon={<BiPlus />}
          variant="outline"
          colorScheme="green"
          onClick={onOpen}
        >
          Add New Category
        </Button>
      </HStack>
      <SearchBar
        search={search}
        setSearch={setSearch}
        placeholder="Search by name, alias, or password"
      />

      {getTasks.data &&
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
        })}
    </Box>
  )
}
