import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
  Textarea,
  FormHelperText,
  Input,
  Select
} from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useAuthContext } from '../context/AuthContext'
import LoginForm from './LoginForm'
import type { NewJuiceRequest, NewSubTask, NewTask } from '../types'
import { useForm } from 'react-hook-form'
import { MdArrowDropDown } from 'react-icons/md'
import { trpc } from '../utils/trpc'

const StyledSpanStart = styled.div`
  color: gray;
  font-size: 1.1rem;
  font-style: italic;
`
const StyledSpanEnd = styled.div`
  color: gray;
  font-size: 1.1rem;
  font-style: italic;
`

interface Props {
  isOpen: boolean
  UserId: string | undefined
  TaskId: string | undefined
  onClose: () => void
  onSubmit: (data: NewSubTask) => void
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onSubmit,
  UserId,
  TaskId
}: Props) {
  const { user } = useAuthContext()
  const [taskName, setTaskName] = useState('')
  const [taskDes, setTaskDes] = useState('')
  const [taskStat, setTaskStat] = useState('pending')
  const [taskAssign, setTaskAssign] = useState(UserId)
  const [taskId, setTaskId] = useState(TaskId)
  const [notes, setNotes] = useState<string>('')
  const [isWriting, setIsWriting] = useState(false)
  // const [notes, setNotes] = useState('')
  const { register, handleSubmit } = useForm()

  const HandleColorModeChange = (light: string, dark: string) => {
    return useColorModeValue(light, dark)
  }

  useEffect(() => {
    if (taskName.length > 0 || taskDes.length > 0 || notes.length > 0) {
      setIsWriting(true)
    } else {
      setIsWriting(false)
    }
  }, [taskName, taskDes, taskStat, notes])

  const clearForm = () => {
    setTaskName('')
    setTaskDes('')
    setNotes('')
  }
  const handleClose = () => {
    // const resetForm = () => {}
    if (isWriting) {
      const confirmation = window.confirm(
        'Are you sure you want to close this modal? All changes will be lost.'
      )
      if (confirmation) {
        resetForm()
        onClose()
      }
    } else {
      onClose()
    }
  }
  const handleSubmit1 = () => {
    onSubmit({
      name: taskName,
      description: taskDes,
      priority: 1,
      assignedToId:
        user.auth == 'admin' && UserId != undefined ? UserId : user.id,
      status: taskStat,
      task_id: TaskId == undefined ? '' : TaskId,
      createdBy: user.id
    })
    clearForm()
    onClose()
  }
  if (!user.firstName) {
    return <LoginForm />
  }

  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Box pb="1.5rem">
              <StyledSpanStart>Please, may I have...</StyledSpanStart>
            </Box> */}
            <FormControl isRequired>
              <FormLabel as="legend">Task Name</FormLabel>
              <Input
                id="name"
                placeholder="First Name"
                variant="outline"
                onChange={event => setTaskName(event.target.value)}
                // value={firstName}
              />
            </FormControl>

            <FormControl>
              <FormLabel as="legend">Task Description</FormLabel>
              <Textarea
                id="description"
                placeholder="Optional notes..."
                // value={notes}
                onChange={e => setTaskDes(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel as="legend">Select Status</FormLabel>
              <Select w="400px" onChange={e => setTaskStat(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Alias"
                hidden={true}
                value={user.id}
                // onChange={event => setAlias(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Alias"
                hidden={true}
                value={1}
                // onChange={event => setAlias(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit1}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
