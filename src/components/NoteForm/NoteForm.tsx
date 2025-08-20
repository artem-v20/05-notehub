import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import * as Yup from 'yup';
import { RiTelegram2Fill } from 'react-icons/ri';

interface FormValues {
  title: string;
  content: string;
  tag: string;
}

interface NoteFormProps {
  closeModal: () => void;
}

const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must have min 3 characters')
    .max(50, 'Title must have max 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Content must have max 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

const NoteForm = ({ closeModal }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      closeModal();
    },
  });

  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      validationSchema={ValidationSchema}
      initialValues={{ title: '', content: '', tag: 'todo' }}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <label className={css.formGroup}>
          Title
          <Field className={css.input} name="title" type="text" />
          <ErrorMessage className={css.error} name="title" component="span" />
        </label>

        <label className={css.formGroup}>
          Content
          <Field
            as="textarea"
            rows={8}
            className={css.textarea}
            name="content"
          />
          <ErrorMessage className={css.error} name="content" component="span" />
        </label>

        <label className={css.formGroup}>
          Tag
          <Field className={css.select} as="select" name="tag">
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage className={css.error} name="status" component="span" />
        </label>
        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={closeModal}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            <RiTelegram2Fill />
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;
