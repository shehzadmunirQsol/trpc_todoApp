import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  BiAddToQueue,
  BiCheck,
  BiCloset,
  BiImageAdd,
  BiPlus,
  BiTaskX,
  BiX
} from 'react-icons/bi'
import { MdCheck, MdDelete } from 'react-icons/md'
import NewSubTaskModal from '../../components/NewSubTaskModal'
import { NewSubTask, NewTask, User } from '../../types'
import { trpc } from '../../utils/trpc'
import { useAuthContext } from '../../context/useAuthContext'

const task = () => {
  const utils = trpc.useContext()
  const { user } = useAuthContext()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const path = useRouter()
  const data = path.query.task?.toString()
  const getTasks = trpc.useQuery([
    'tasks.getTaskById',
    {
      id: data
    }
  ])
  const getSubTasks = trpc.useQuery([
    'tasks.getSubTasksById',
    {
      task_id: data
    }
  ])
  const createTaskRequest = trpc.useMutation('tasks.createSubTask')
  const updateSubTask = trpc.useMutation('tasks.updateSubTask')
  const deleteSubTask = trpc.useMutation('tasks.deleteSubTask')

  const getTaskById = getTasks.data
  const handleCreateJuiceRequest = useCallback(
    async (data: NewSubTask) => {
      await createTaskRequest.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getSubTasksById'])
        }
      })
    },
    [createTaskRequest, utils]
  )
  // update sub task
  const handleCheck = async (task: any) => {
    await updateSubTask.mutateAsync(
      { ...task },
      {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getSubTasksById'])
        }
      }
    )
  }
  // delete sub task
  const handleDelete = async (id: any) => {
    await deleteSubTask.mutateAsync(
      { id: id },
      {
        onSuccess: () => {
          utils.invalidateQueries(['tasks.getSubTasksById'])
        }
      }
    )
  }

  return (
    <>
      <Card>
        <NewSubTaskModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleCreateJuiceRequest}
          UserId={getTaskById?.assignedToId.toString()}
          TaskId={data}
        />
        <CardHeader>
          <Flex
            gap="2"
            py={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box w="80%">
              <Heading size="md">{getTaskById?.name}</Heading>
              <Text pt="2" fontSize="sm">
                {getTaskById?.description}
              </Text>
            </Box>

            <Button
              leftIcon={
                getTaskById?.status == 'pending' ? <BiTaskX /> : <BiCheck />
              }
              variant="outline"
              colorScheme={getTaskById?.status == 'pending' ? 'red' : 'green'}
              size="sm"
            >
              {getTaskById?.status}
            </Button>

            {getTaskById?.status != 'Completed' && (
              <Button
                px={4}
                leftIcon={<BiPlus />}
                variant="outline"
                colorScheme="white"
                onClick={onOpen}
                size="sm"
                fontSize={'sm'}
              >
                Add Sub Task
              </Button>
            )}
          </Flex>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {getSubTasks != undefined ? (
              getSubTasks?.data?.map((ele, i) => (
                <Flex
                  key={i}
                  gap="2"
                  py={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box w="80%">
                    <Heading size="xs" textTransform="uppercase">
                      {ele.name}
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {ele.description}
                    </Text>
                  </Box>
                  {ele.status != 'Completed' ? (
                    <IconButton
                      variant="ghost"
                      aria-label="more information"
                      icon={<MdCheck />}
                      onClick={() => handleCheck(ele)}
                      size="sm"
                    />
                  ) : (
                    <Button
                      leftIcon={<BiCheck />}
                      variant="outline"
                      colorScheme="green"
                      size="sm"
                    >
                      Completed
                    </Button>
                  )}
                  <IconButton
                    variant="ghost"
                    aria-label="more information"
                    icon={<MdDelete />}
                    onClick={() => handleDelete(ele.id)}
                    size="sm"
                  />
                </Flex>
              ))
            ) : (
              <Flex
                gap="2"
                py={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box w="80%">
                  <Text pt="2" fontSize="sm">
                    No Data found
                  </Text>
                </Box>
              </Flex>
            )}
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}

export default task
