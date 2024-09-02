export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'createdAt' : Time,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'completeTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
