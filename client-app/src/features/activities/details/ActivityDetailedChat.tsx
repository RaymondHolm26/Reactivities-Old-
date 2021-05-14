import { Formik, Form, Field, FieldProps } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Comment, Loader, Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedChat({ activity }: Props) {
  const { commentStore, userStore } = useStore();
  useEffect(() => {
    if (activity.id) {
      commentStore.createHubConnection(activity.id);
    }
    return () => {
      commentStore.clearComments();
    };
  }, [commentStore, activity.id]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment clearing>
        <Formik
          onSubmit={(values, { resetForm }) =>
            commentStore.addComment(values).then(() => resetForm())
          }
          initialValues={{ body: "" }}
          validationSchema={Yup.object({ body: Yup.string().required() })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="Enter your comment (Enter to submit, Shift + Enter for new line)"
                      rows={2}
                      {...props.field}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>
        <Comment.Group>
          {commentStore.comments.map((comment) => {
            return userStore.user?.displayName !== comment.displayName ? (
              <Grid celled="internally">
                <Grid.Column width={6}></Grid.Column>
                <Grid.Column width={10}>
                  <Comment
                    key={comment.id}
                    style={{
                      borderRadius: "10px",
                      border: "1px solid #EAEAEA",
                      padding: "5px",
                    }}
                    className="commentColor"
                  >
                    <Comment.Avatar
                      as={Link}
                      to={`/profiles/${comment.username}`}
                      src={comment.image || "/assets/user.png"}
                      style={{
                        border: "1px solid",
                        borderColor: "#fff",
                        borderRadius: "5px",
                      }}
                    />
                    <Comment.Content>
                      <Comment.Author
                        as={Link}
                        to={`/profiles/${comment.username}`}
                        style={{ color: "white" }}
                      >
                        {comment.displayName}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div style={{ color: "white" }}>
                          {formatDistanceToNow(comment.createdAt)} ago
                        </div>
                      </Comment.Metadata>
                      <Comment.Text
                        style={{ whiteSpace: "pre-wrap", color: "white" }}
                      >
                        {comment.body}
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Grid.Column>
              </Grid>
            ) : (
              <Grid celled="internally">
                <Grid.Column width={10}>
                  <Comment
                    key={comment.id}
                    style={{
                      backgroundColor: "#F4F4F4",
                      borderRadius: "10px",
                      border: "1px solid #EAEAEA",
                      padding: "5px",
                    }}
                  >
                    <Comment.Avatar
                      as={Link}
                      to={`/profiles/${comment.username}`}
                      src={comment.image || "/assets/user.png"}
                    />
                    <Comment.Content>
                      <Comment.Author
                        as={Link}
                        to={`/profiles/${comment.username}`}
                      >
                        {comment.displayName}
                      </Comment.Author>
                      <Comment.Metadata>
                        <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                      </Comment.Metadata>
                      <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                        {comment.body}
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Grid.Column>
                <Grid.Column width={6}></Grid.Column>
              </Grid>
            );
          })}
        </Comment.Group>
      </Segment>
    </>
  );
});
