/* 
  This is the homepage of the website.
  It is the first page that users see when they open the website.
  This will hold a few dashboard for 
*/
import { useState, useCallback } from 'react'

import { Button, Flex, Heading, Text,useDisclosure } from '@chakra-ui/react'
import type { NextPage } from 'next'
// import { trpc } from '../utils/trpc'
import { useAuthContext } from '../context/AuthContext' // import User state
import LoginForm from '../components/LoginForm'
import NewUserModal from '../components/NewUserModal'
import { FaUserPlus } from 'react-icons/fa'
import { NewUser } from '../types'
import { trpc } from '../utils/trpc'

// todo
// integrate login check
const Home: NextPage = () => {
  const { user } = useAuthContext()
  // const userQuery = trpc.useQuery(['users.getUsers'])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const utils = trpc.useContext()

  
  const createUser = trpc.useMutation('users.createUser')
  const handleCreateUser = useCallback(
    async (data: NewUser) => {
      await createUser.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['users.getUsers'])
        }
      })
    },
    [createUser, utils]
  )
  
  if (!user.firstName) return (
    <>
    <Flex justify="center" align='center' direction="column" gap={10}>

    <NewUserModal
        handleCreateUser={handleCreateUser}
        isOpen={isOpen}
        onClose={onClose}
        />
       <Button
            variant="outline"
            leftIcon={<FaUserPlus />}
            colorScheme="green"
            onClick={onOpen}
          >
            New User
          </Button>
      <LoginForm />
            </Flex>
    </>
  ) // if user is not logged in, return Auth component

  return (
    <>
      <Heading pb={2}>{`Welcome, ${
        user.alias ? user.alias : user.firstName
      }.`}</Heading>
      <Heading size="sm" pb={2}>
        I want to say that this project is still under development.
      </Heading>
      <Text>
        
      </Text>
    </>
  )
}

export default Home
