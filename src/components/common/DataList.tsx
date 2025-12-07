import React from 'react';
import { Link } from 'react-router-dom';
import '../farmer/Farmer.css';

interface DataListProps {
  title: string;
  addNewLink: string;
  children: React.ReactNode;
}

const DataList: React.FC<DataListProps> = ({ title, addNewLink, children }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{title}</h2>
        <Link to={addNewLink} className="btn btn-primary">
          Add New
        </Link>
      </div>
      {children}
    </div>
  );
};

export default DataList;
