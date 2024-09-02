import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Task = {
    id: Nat;
    description: Text;
    categories: [Text];
    completed: Bool;
    createdAt: Time.Time;
  };

  stable var taskId: Nat = 0;
  let taskMap = HashMap.HashMap<Nat, Task>(10, Nat.equal, Nat.hash);

  let defaultCategories: [Text] = [
    "Work", "Home", "School", "Shopping", "Personal",
    "Sports", "Crypto", "Stocks", "Fitness", "Entertainment"
  ];

  public func addTask(description: Text, categories: [Text]) : async Nat {
    let id = taskId;
    taskId += 1;
    let taskCategories = if (categories.size() == 0) { defaultCategories } else { categories };
    let task: Task = {
      id = id;
      description = description;
      categories = taskCategories;
      completed = false;
      createdAt = Time.now();
    };
    taskMap.put(id, task);
    id
  };

  public query func getTasks() : async [Task] {
    Iter.toArray(taskMap.vals())
  };

  public query func getDefaultCategories() : async [Text] {
    defaultCategories
  };

  public func completeTask(id: Nat) : async Bool {
    switch (taskMap.get(id)) {
      case (null) { false };
      case (?task) {
        let updatedTask: Task = {
          id = task.id;
          description = task.description;
          categories = task.categories;
          completed = true;
          createdAt = task.createdAt;
        };
        taskMap.put(id, updatedTask);
        true
      };
    }
  };

  public func deleteTask(id: Nat) : async Bool {
    switch (taskMap.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  system func preupgrade() {
    // Convert HashMap to stable array before upgrade
    taskId := taskMap.size();
  };

  system func postupgrade() {
    // Reinitialize HashMap after upgrade if needed
  };
}
