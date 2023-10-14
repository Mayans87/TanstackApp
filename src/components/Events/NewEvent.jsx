import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent, queryClient } from './util/http.js';
import { useMutation } from '@tanstack/react-query';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function NewEvent() {
  const navigate = useNavigate();

 const{mutate,isPending,error,isError}= useMutation({
    mutationFn: createNewEvent,
    onSuccess:()=>{navigate('/events'),
  queryClient.invalidateQueries({queryKey:['events']});}
    
  })
  function handleSubmit(formData) {
    mutate({event:formData});
  }
  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending &&<p>Submitting...</p>}
        {!isPending &&(
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>)}
      </EventForm>
      {isError && <ErrorBlock title='Failed to crete new event' message={error.info?.message || 'Event Creation Utter failure.'}/>}
    </Modal>
  );
}
