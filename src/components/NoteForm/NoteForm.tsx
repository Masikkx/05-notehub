import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "../../services/noteService";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

const NoteSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Required"),
  content: Yup.string().max(500, "Maximum 500 characters"),
  tag: Yup.mixed<typeof TAGS[number]>()
    .oneOf(TAGS)
    .required("Required"),
});

interface Props {
  onCancel: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: typeof TAGS[number];
}

export default function NoteForm({ onCancel }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={(values) =>
        mutate({
          title: values.title,
          content: values.content,
          tag: values.tag,
        })
      }
    >
      {({ handleSubmit, handleChange, values, errors, touched }) => (
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={css.input}
              value={values.title}
              onChange={handleChange}
            />
            {touched.title && errors.title && (
              <span className={css.error}>{errors.title}</span>
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              value={values.content}
              onChange={handleChange}
            />
            {touched.content && errors.content && (
              <span className={css.error}>{errors.content}</span>
            )}
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              className={css.select}
              value={values.tag}
              onChange={handleChange}
            >
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            {touched.tag && errors.tag && (
              <span className={css.error}>{errors.tag}</span>
            )}
          </div>

          <div className={css.actions}>
            <button type="button" onClick={onCancel} className={css.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isPending}>
              Create note
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}
