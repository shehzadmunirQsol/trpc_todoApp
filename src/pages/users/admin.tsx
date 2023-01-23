

import { useState, useCallback } from 'react'
import { trpc } from '../../utils/trpc'
import {
  Heading,
  HStack,
  Stack,
  Flex,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  IconButton,
  Table,
  Tbody,
  Td,
  Tr,
  SimpleGrid
} from '@chakra-ui/react'
import { FaUserPlus } from 'react-icons/fa'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import SearchBar from '../../components/SearchBar'
import UserCard from '../../components/UserCard'
import LoginForm from '../../components/LoginForm'
import NewUserModal from '../../components/NewUserModal'
import { useAuthContext } from '../../context/AuthContext'
import type { User, NewUser } from '../../types'

export default function Index() {
  const { user } = useAuthContext()
  const utils = trpc.useContext()
  const createUser = trpc.useMutation('users.createUser')
  const getUsers = trpc.useQuery(['users.getUsers'])
  const updateUser = trpc.useMutation('users.updateUser')
  const deleteUser = trpc.useMutation('users.deleteUser')
  const [authFilter, setAuthFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isPopOverOpen,
    onOpen: onPopOverOpen,
    onClose: onPopOverClose
  } = useDisclosure()

  // this updates the UI when the userQuery data is first loaded.
  // useEffect(() => {
  //   if (getUsers.isFetching) setUsers(undefined)
  //   if (getUsers.isFetched) setUsers(getUsers.data)
  // }, [getUsers.data, getUsers.isFetched, getUsers.isFetching])

  const handleUserDelete = useCallback(
    async (uid: string) => {
      await deleteUser.mutateAsync(
        { id: uid },
        {
          onSuccess: () => {
            utils.invalidateQueries(['users.getUsers'])
          }
        }
      )
    },
    [deleteUser, utils]
  )

  const handleUserUpdate = useCallback(
    async (data: User) => {
      await updateUser.mutateAsync(data, {
        onSuccess: () => {
          utils.invalidateQueries(['users.getUsers'])
        }
      })
    },
    [updateUser, utils]
  )

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

  const handleRadioButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthFilter(e.target.value)
  }

  // this filters users by the radio buttons
  const filteredUsers = getUsers.data?.filter(user => {
    if (authFilter === 'all') return true
    return user.auth === authFilter
  })

  // this is the search bar logic
  // it will search for every word in the search bar,
  const liveSearch = () => {
    return filteredUsers?.filter(user => {
      const firstName = user.firstName.toLowerCase()
      const lastName = user.lastName.toLowerCase()
      const alias = user.alias?.toLowerCase()
      const password = user.password.toLowerCase()
      const searchWords = search.toLowerCase().split(' ')
      return searchWords.every(word => {
        return (
          firstName.includes(word) ||
          lastName.includes(word) ||
          alias?.includes(word) ||
          password.includes(word)
        )
      })
    })
  }

  if (!user.firstName) return <LoginForm /> // if user is not logged in, return Auth component

  return (
    <>
      <NewUserModal
        handleCreateUser={handleCreateUser}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Stack gap={3}>
        <Flex justify="space-between">
          <Heading>{'Users'}</Heading>
          <Button
            variant="outline"
            leftIcon={<FaUserPlus />}
            colorScheme="green"
            onClick={onOpen}
          >
            New User
          </Button>
        </Flex>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search by name, alias, or password"
        />
       <SimpleGrid columns={2} spacing={10}>
        {getUsers.data &&
          liveSearch()?.map((user: any) => (
            <UserCard
              key={user.id}
              handleUserDelete={handleUserDelete}
              handleUserUpdate={handleUserUpdate}
              uid={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              alias={user.alias}
              password={user.password}
              auth={user.auth}
              />
              ))}
          
              </SimpleGrid>
      </Stack>
    </>
  )
}
