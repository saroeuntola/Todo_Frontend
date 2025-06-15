'use_client';
import TodoList from './todo/page';
export default function Home() {
  return (
    <div className="mt-14 flex justify-center">
      <TodoList />
    </div>
  );
}
