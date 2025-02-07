const UserList = ({ users, setSelectedUser, unreadMessages }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {users && users.map(u => (
        <div 
          key={u._id} 
          onClick={() => setSelectedUser(u)}
          className="flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-200"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {u.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              u.online ? 'bg-green-500' : 'bg-gray-400'
            }`}></span>
            {unreadMessages[u._id] > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages[u._id]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{u.name}</h3>
            <p className="text-sm text-gray-500">
              {u.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
