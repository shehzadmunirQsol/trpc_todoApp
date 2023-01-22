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
  console.log(getTasks.data)
  const getUsers = trpc.useQuery(['users.getUsers'])

  const HandleColorModeChange = useColorModeValue('gray.600', 'gray.400')
  const utils = trpc.useContext()

  const deleteTask = trpc.useMutation('tasks.deleteTask')
  const updateTask = trpc.useMutation('tasks.updateTask')
  const createTaskRequest = trpc.useMutation('tasks.createTask')
  const [taskRequests, setTaskRequests] = useState<Task | undefined>()
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
  console.log(getUsers.data)
  if (!user.firstName) return <LoginForm />
  return (
    <Box maxW="container.lg">
      <NewTaskModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateJuiceRequest}
      />

      <HStack justify="space-between" mb={4}>
        <Heading>{data?.toUpperCase()} TASKS</Heading>
        <Button
          leftIcon={<BiPlus />}
          variant="outline"
          colorScheme="green"
          onClick={onOpen}
        >
          Add New Task
        </Button>
      </HStack>

      {getTasks.data &&
        getTasks.data.map(task => {
          return (
            <>
              <Flex
                key={task.id}
                gap="2"
                py={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box w="80%">
                  <TaskItem task={task} />
                </Box>

                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      variant="ghost"
                      aria-label="more information"
                      icon={<AddIcon />}
                      size="sm"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>{task.name}</PopoverHeader>
                    <PopoverBody>{task.description}</PopoverBody>
                  </PopoverContent>
                </Popover>
                {task.status != 'Completed' && (
                  <IconButton
                    variant="ghost"
                    aria-label="more information"
                    icon={<MdCheck />}
                    onClick={() => handleCheck(task)}
                    size="sm"
                  />
                )}
                <IconButton
                  variant="ghost"
                  aria-label="more information"
                  icon={<MdDelete />}
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                />
                {user.auth == 'admin' && task.status != 'Completed' ? (
                  <>
                    <Link href={`/tasks/${task.id}`}>
                      <IconButton
                        variant="ghost"
                        aria-label="more information"
                        icon={<IoMdEye />}
                        size="sm"
                      ></IconButton>
                    </Link>
                  </>
                ) : (
                  <Link href={`/tasks/${task.id}`}>
                    <IconButton
                      variant="ghost"
                      aria-label="more information"
                      icon={<IoMdEye />}
                      size="sm"
                    ></IconButton>
                  </Link>
                )}
              </Flex>
              <Divider />
            </>
          )
        })}
    </Box>
  )
}
