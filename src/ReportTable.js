import React from 'react';

function ReportTable({ files, urls }) {
  return (
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index}>
            <td>{file.name}</td>
            <td>
              <a href={urls[index]} target="_blank" rel="noopener noreferrer">Download Report</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ReportTable;
