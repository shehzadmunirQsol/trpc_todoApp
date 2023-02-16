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
  Td,
  Box,
  Stack,
  Heading,
  Text,
  AspectRatio,
  Flex,
  Spacer,
  IconButton,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'
import type { Categories, NewCategory, NewProducts, User } from '../types'
import { DeleteIcon } from '@chakra-ui/icons'
import { MdArrowDropDown } from 'react-icons/md'
import { trpc } from '../utils/trpc'

interface Props {
  handleCreateProducts: (data: NewProducts) => void
  handleUpdateCategories: (data: Categories) => void
  uid: string
  category_name: string
  category_desc: string
  status: number

  isOpen: boolean
  onClose: () => void
}

function UpdateProductModal({
  handleCreateProducts,
  handleUpdateCategories,
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
  const [taskAssign, setTaskAssign] = useState('')

  const getUsers = trpc.useQuery(['categrories.getCategories'])

  console.log(categoryName, 'category_name')
  //   const router = useRouter()

  // check to see if the user has edited the form
  useEffect(() => {
    setNewCategoryName(category_name)
    setNewCategoryDesc(category_desc)
    setNewStatus(status)
  }, [uid, category_name, category_desc, status])

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
    if (uid === '' || uid === undefined) {
      handleCreateProducts({
        product_name: categoryName,
        product_des: newCategoryDesc,
        status: newStatus,
        product_img: '',
        category_id: '1',
        amount: 1,
        qty: 1,
        createdBy: '1'
      })
    } else {
      // handleUpdateCategories({
      //   id: uid,
      //   category_name: categoryName,
      //   category_desc: newCategoryDesc,
      //   status: newStatus,
      //   createdBy: '1'
      // })
      handleCreateProducts({
        product_name: categoryName,
        product_des: newCategoryDesc,
        status: +newStatus,
        product_img: '',
        category_id: '1',
        amount: 1,
        qty: 1,
        createdBy: '1'
      })
    }
    onClose()
  }
  const [selectedImage, setSelectedImage] = useState(null)

  // This function will be triggered when the file field change
  const imageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0])
    }
  }
  console.log(selectedImage, 'selectedImage')
  const removeSelectedImage = () => {
    setSelectedImage(null)
  }
  const format = (val: any) => `$` + val
  const parse = (val: any) => val.replace(/^\$/, '')

  const [amount, setAmount] = React.useState('1.53')
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
              <AspectRatio
                width="96"
                ratio={1.5}
                display="flex"
                alignItems="left"
              >
                <Box
                  borderColor="gray.300"
                  borderStyle="dashed"
                  borderWidth="2px"
                  rounded="md"
                  shadow="sm"
                  role="group"
                  transition="all 150ms ease-in-out"
                  _hover={{
                    shadow: 'md'
                  }}
                >
                  <Box position="relative" height="100%" width="100%">
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height="100%"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                    >
                      <Stack
                        height="100%"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justify="center"
                        spacing="4"
                      >
                        <Box height={'400px'} width="80" position="relative">
                          <Box
                            bg="white"
                            top="2"
                            height="100%"
                            width="100%"
                            position="absolute"
                            borderWidth="1px"
                            borderStyle="solid"
                            rounded="sm"
                            borderColor="gray.400"
                            backgroundSize="cover"
                            backgroundRepeat="no-repeat"
                            backgroundPosition="center"
                            backgroundImage={`url(${
                              selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : 'https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg'
                            })`}
                          />

                          {/* <PreviewImage
                            variants={first}
                            backgroundImage="url('https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg')"
                          />
                          <PreviewImage
                            variants={second}
                            backgroundImage="url('https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2628&q=80')"
                          />
                          <PreviewImage
                            variants={third}
                            backgroundImage={`url("https://images.unsplash.com/photo-1563612116625-3012372fccce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2480&q=80")`}
                          /> */}
                        </Box>
                        <Stack p="6" textAlign="center" spacing="1">
                          <Heading
                            fontSize="lg"
                            color="gray.500"
                            fontWeight="bold"
                          >
                            Drop images here{' '}
                          </Heading>

                          <Text fontWeight="light">or click to upload</Text>
                        </Stack>
                      </Stack>
                    </Box>
                    <Input
                      type="file"
                      height="100%"
                      width="100%"
                      position="absolute"
                      top="0"
                      left="0"
                      opacity="0"
                      onChange={e => imageChange(e)}
                      aria-hidden="true"
                      accept="image/*"
                    />

                    {selectedImage && (
                      <IconButton
                        float={'right'}
                        colorScheme="blue"
                        aria-label="Search database"
                        icon={<DeleteIcon />}
                        onClick={removeSelectedImage}
                      />
                    )}
                  </Box>
                </Box>
              </AspectRatio>
              <FormControl isRequired>
                <FormLabel as="legend">Product Name</FormLabel>
                <Input
                  placeholder="Category Name"
                  variant="outline"
                  onChange={event => setNewCategoryName(event.target.value)}
                  value={categoryName}
                />
              </FormControl>

              <FormControl>
                <FormLabel as="legend">Product Description</FormLabel>
                <Input
                  placeholder="Product Description"
                  variant="outline"
                  onChange={event => setNewCategoryDesc(event.target.value)}
                  value={newCategoryDesc}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel as="legend">Select Category</FormLabel>
                <Select
                  icon={<MdArrowDropDown />}
                  placeholder="Select Category"
                  onChange={e => setTaskAssign(e.target.value)}
                >
                  {getUsers.data &&
                    getUsers.data.map((val, i) => (
                      <option key={i} value={val.id}>
                        {val.category_name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <Flex alignItems="center" gap="2">
                <FormControl>
                  <FormLabel as="legend">Product Amount</FormLabel>
                  <NumberInput
                    defaultValue={10}
                    onChange={valueString => setAmount(parse(valueString))}
                    value={format(amount)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {/* <Input
                    type={'number'}
                    placeholder="Product Amount"
                    variant="outline"
                    onChange={event => setNewCategoryDesc(event.target.value)}
                    value={newCategoryDesc}
                  /> */}
                </FormControl>
                <FormControl>
                  <FormLabel as="legend">Product Qty</FormLabel>
                  <NumberInput defaultValue={1}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {/* <Input
                    type={'number'}
                    placeholder="Product Qty"
                    variant="outline"
                    defaultValue={15}
                    onChange={event => setNewCategoryDesc(event.target.value)}
                    value={newCategoryDesc}
                  /> */}
                </FormControl>
              </Flex>

              <FormControl isRequired as="fieldset">
                <FormLabel as="legend">Prodcut Status</FormLabel>
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

export default UpdateProductModal
