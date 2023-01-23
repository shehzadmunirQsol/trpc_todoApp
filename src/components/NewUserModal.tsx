

import React, { useEffect } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  VStack,
  FormHelperText,
  Table,
  Tbody,
  Tr,
  Td
} from '@chakra-ui/react'
import type { NewUser } from '../types'

interface Props {
  handleCreateUser: (data: NewUser) => Promise<void>
  isOpen: boolean
  onClose: () => void
}

function NewUserModal({ handleCreateUser, isOpen, onClose }: Props) {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [alias, setAlias] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [authLevel, setAuthLevel] = React.useState('user')
  const [isWriting, setIsWriting] = React.useState(false)

  useEffect(() => {
    if (firstName || lastName || alias || password) {
      setIsWriting(true)
    } else {
      setIsWriting(false)
    }
  }, [firstName, lastName, alias, password])

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setAlias('')
    setPassword('')
    setAuthLevel('user')
  }
  const handleClose = () => {
    if (isWriting) {
      const confirmation = window.confirm(
        'Are you sure you want to close this modal? All data will be lost.'
      )
      if (confirmation) {
        clearForm()
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthLevel(e.target.value)
  }

  const handleSubmit = () => {
    // confirm that required fields are filled out
    if (firstName === '' || lastName === '' || password === '') {
      alert('Please fill out all required fields.')
    } else {
      handleCreateUser({
        firstName,
        lastName,
        alias,
        password,
        auth: authLevel
      })
      clearForm()
      onClose()
    }
  }

  return (
    <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="25px">
            <FormControl isRequired>
              <FormLabel as="legend">First Name</FormLabel>
              <Input
                placeholder="First Name"
                variant="outline"
                onChange={event => setFirstName(event.target.value)}
                value={firstName}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                variant="outline"
                onChange={event => setLastName(event.target.value)}
                value={lastName}
              />
            </FormControl>
            <FormControl>
              <FormLabel as="legend">Alias or Nickname</FormLabel>
              <Input
                placeholder="Alias"
                variant="outline"
                onChange={event => setAlias(event.target.value)}
                value={alias}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel as="legend">Password</FormLabel>
              <Input
                placeholder="Password"
                variant="outline"
                onChange={event => setPassword(event.target.value)}
                value={password}
              />
              <FormHelperText>
                Use the 4 digit unique password to login
              </FormHelperText>
            </FormControl>
            
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default NewUserModal
