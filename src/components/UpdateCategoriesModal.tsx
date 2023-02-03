

import React, { useEffect, useState } from 'react'
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
import type { User } from '../types'

interface Props {
  handleUserUpdate: (data: User) => void
  uid: string
  firstName: string
  lastName: string
  alias: string
  password: string
  authLevel: string
  isOpen: boolean
  onClose: () => void
}

function UpdateUserModal({
  handleUserUpdate,
  uid,
  firstName,
  lastName,
  alias,
  password,
  authLevel,
  isOpen,
  onClose
}: Props) {
  const [newFirstName, setNewFirstName] = useState(firstName)
  const [newLastName, setNewLastName] = useState(lastName)
  const [newAlias, setNewAlias] = useState(alias)
  const [newPassword, setNewPassword] = useState(password)
  const [newAuthLevel, setNewAuthLevel] = useState(authLevel)
  const [isWriting, setIsWriting] = useState(false)
  //   const router = useRouter()

  // check to see if the user has edited the form
  useEffect(() => {
    if (
      newFirstName !== firstName ||
      newLastName !== lastName ||
      newAlias !== alias ||
      newPassword !== password ||
      newAuthLevel !== authLevel
    ) {
      setIsWriting(true)
    }
  }, [
    firstName,
    lastName,
    alias,
    password,
    authLevel,
    newFirstName,
    newLastName,
    newAlias,
    newPassword,
    newAuthLevel
  ])

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAuthLevel(e.target.value)
  }

  const handleClose = () => {
    const resetForm = () => {
      setNewFirstName(firstName)
      setNewLastName(lastName)
      setNewAlias(alias)
      setNewPassword(password)
      setNewAuthLevel(authLevel)
    }
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

  const onUpdate = () => {
    handleUserUpdate({
      id: uid,
      firstName: newFirstName,
      lastName: newLastName,
      alias: newAlias,
      password: newPassword,
      auth: newAuthLevel
    })
    onClose()
  }

  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="25px">
              <FormControl isRequired>
                <FormLabel as="legend">First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  variant="outline"
                  onChange={event => setNewFirstName(event.target.value)}
                  value={newFirstName}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel as="legend">Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  variant="outline"
                  onChange={event => setNewLastName(event.target.value)}
                  value={newLastName}
                />
              </FormControl>
              <FormControl>
                <FormLabel as="legend">Alias or Nickname</FormLabel>
                <Input
                  placeholder="Alias"
                  variant="outline"
                  onChange={event => setNewAlias(event.target.value)}
                  value={newAlias}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel as="legend">Password</FormLabel>
                <Input
                  placeholder="Password"
                  variant="outline"
                  onChange={event => setNewPassword(event.target.value)}
                  value={newPassword}
                />
                <FormHelperText>
                  Use the Unique password
                </FormHelperText>
              </FormControl>
              <FormControl isRequired as="fieldset">
                <FormLabel as="legend">Authorization Level</FormLabel>
                <RadioGroup value={newAuthLevel}>
                  <HStack spacing="24px">
                    <Radio value="user" onChange={handleOptionChange}>
                      User
                    </Radio>
                  
                    <Radio value="admin" onChange={handleOptionChange}>
                      Admin
                    </Radio>
                  </HStack>
                </RadioGroup>
            
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outline" colorScheme="blue" onClick={onUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateUserModal
