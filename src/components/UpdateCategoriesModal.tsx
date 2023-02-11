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
import type { Categories, NewCategory, User } from '../types'

interface Props {
  handleCreateCategories: (data: NewCategory) => void
  handleUpdateCategories: (data: Categories) => void
  uid: string
  category_name: string
  category_desc: string
  status: number

  isOpen: boolean
  onClose: () => void
}

function UpdateCategoryModal({
  handleCreateCategories,
  uid,
  category_name,
  category_desc,
  status,

  isOpen,
  onClose
}: Props) {
  const [categoryName, setNewCategoryName] = useState(category_name)
  const [newCategoryDesc, setNewCategoryDesc] = useState(category_desc)
  const [newStatus, setNewStatus] = useState(status)
  const [isWriting, setIsWriting] = useState(false)

  //   const router = useRouter()

  // check to see if the user has edited the form
  // useEffect(() => {
  //   if (
  //     newFirstName !== firstName ||
  //     newLastName !== lastName ||
  //     newAlias !== alias ||
  //     newPassword !== password ||
  //     newAuthLevel !== authLevel
  //   ) {
  //     setIsWriting(true)
  //   }
  // }, [
  //   firstName,
  //   lastName,
  //   alias,
  //   password,
  //   authLevel,
  //   newFirstName,
  //   newLastName,
  //   newAlias,
  //   newPassword,
  //   newAuthLevel
  // ])

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStatus(+e.target.value)
  }

  const handleClose = () => {
    const resetForm = () => {
      setNewCategoryName(category_name)
      setNewCategoryDesc(category_desc)
      setNewStatus(status)
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
    if (uid != '') {
    } else {
      handleCreateCategories({
        category_name: categoryName,
        category_desc: newCategoryDesc,
        status: newStatus,
        createdBy: '1'
      })
    }
    onClose()
  }

  return (
    <>
      <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {uid != '' ? 'Update ' : 'Create '} Categories
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="25px">
              <FormControl isRequired>
                <FormLabel as="legend">Category Name</FormLabel>
                <Input
                  placeholder="Category Name"
                  variant="outline"
                  onChange={event => setNewCategoryName(event.target.value)}
                  value={categoryName}
                />
              </FormControl>
              <FormControl>
                <FormLabel as="legend">Category Description</FormLabel>
                <Input
                  placeholder="Category Description"
                  variant="outline"
                  onChange={event => setNewCategoryDesc(event.target.value)}
                  value={newCategoryDesc}
                />
              </FormControl>

              <FormControl isRequired as="fieldset">
                <FormLabel as="legend">Category Status</FormLabel>
                <RadioGroup value={newStatus.toString()}>
                  <HStack spacing="24px">
                    <Radio value="1" onChange={handleOptionChange}>
                      Active
                    </Radio>

                    <Radio value="0" onChange={handleOptionChange}>
                      Non Active
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
              {uid != '' ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateCategoryModal
