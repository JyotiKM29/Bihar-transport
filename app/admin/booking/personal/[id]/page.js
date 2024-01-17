// import {  useRouter } from 'next/router'



const page = ({params}) => {
    // const router = useRouter();
    // const { id } = router.query;

  return (
    <div>
      <h1>User :{params.id}</h1>
    </div>
  )
}

export default page
