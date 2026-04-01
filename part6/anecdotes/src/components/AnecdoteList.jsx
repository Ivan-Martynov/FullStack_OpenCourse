import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { notify } from "../reducers/notificationReducer";

const fuzzySearch = (needle, haystack) => {
  if (needle.length > haystack.length) {
    return false;
  } else if (needle.length === haystack.length) {
    return needle === haystack;
  }

  outer: for (let i = 0, j = -1; i < needle.length; ++i) {
    const charCode = needle.charCodeAt(i);
    while (++j < haystack.length) {
      if (haystack.charCodeAt(j) === charCode) {
        continue outer;
      }
    }
    return false;
  }
  return true;
};

const Anecdote = ({ anecdote, handleVote }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} vote{anecdote.votes !== 1 ? "s" : ""}
        <button onClick={handleVote}>vote</button>
      </div>
    </div>
  );
};

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    const result = filter
      ? anecdotes.filter((item) =>
          fuzzySearch(filter.toLowerCase(), item.content.toLowerCase()),
        )
      : anecdotes;

    return result;
  });

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);
  return sortedAnecdotes.map((anecdote) => (
    <Anecdote
      key={anecdote.id}
      anecdote={anecdote}
      handleVote={() => {
        dispatch(voteAnecdote(anecdote));
        dispatch(
          notify({
            message: `You voted "${anecdote.content}"`,
            class: "success",
          }),
        );
      }}
    />
  ));
};

export default AnecdoteList;
