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
import { NewTask, User } from '../../types'
import { trpc } from '../../utils/trpc'
import { useAuthContext } from '../../context/AuthContext'

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
  const createTaskRequest = trpc.useMutation('tasks.createTask')

  const getTaskById = getTasks.data
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
          </Flex>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Flex
              gap="2"
              py={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box w="80%">
                <Heading size="xs" textTransform="uppercase">
                  Summary
                </Heading>
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
              </Box>
              <IconButton
                variant="ghost"
                aria-label="more information"
                icon={<MdCheck />}
                size="sm"
              />
              <IconButton
                variant="ghost"
                aria-label="more information"
                icon={<MdDelete />}
                size="sm"
              />
            </Flex>
            <Flex
              gap="2"
              py={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box w="80%">
                <Heading size="xs" textTransform="uppercase">
                  Summary
                </Heading>
                <Text pt="2" fontSize="sm">
                  View a summary of all your clients over the last month.
                </Text>
              </Box>
              <IconButton
                variant="ghost"
                aria-label="more information"
                icon={<MdCheck />}
                size="sm"
              />
              <IconButton
                variant="ghost"
                aria-label="more information"
                icon={<MdDelete />}
                size="md"
              />
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}

export default task
