import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useQuery,useMutation } from '@tanstack/react-query';
import { fetchEvent,deleteEvent, queryClient } from './util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx'

export default function EventDetails() {
  const navigate = useNavigate();






  const params=useParams();
const {data,error,isError,isPending}=useQuery({
  queryKey:['events',params.id],
  queryFn:({signal})=>fetchEvent({signal,id:params.id})
})
const{mutate}=useMutation({
  mutationFn: deleteEvent,
  onSuccess:()=>{queryClient.invalidateQueries({queryKey:['events'],refetchType:'none'});
  navigate('/events')}
})
let content;
if(isPending){
  content=(<div id='event-details-content' className='center'>
    <p>fetching event data...</p>
  </div>)
}
if(isError){
  content=<div id='event-details-content' className='center'>
    <ErrorBlock title="failed to load" message={error.info?.message || 'error'}/>
  </div>
}
if(data){
  const formatteddate = new Date(data.date).toLocaleDateString('en-US',{
    day: 'numeric',
    month:'short',
    year:'numeric'
  })
  function handledelete(){
    mutate({id:params.id})
  }
  content=(
    <> <header>
    <h1>{data.title}</h1>
    <nav>
      <button onclick={handledelete}>Delete</button>
      <Link to="edit">Edit</Link>
    </nav>
  </header><div id="event-details-content">
  <img src={`http://localhost:3000/${data.image}`} alt="img" />
  <div id="event-details-info">
    <div>
      <p id="event-details-location">{data.location}</p>
      <time dateTime={`Todo-DateT$Todo-Time`}>{formatteddate} @ {data.time}</time>
    </div>
    <p id="event-details-description">{data.description}</p>
  </div>
</div></>)
}



  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
       
        { content}
        
      </article>
    </>
  );
}
