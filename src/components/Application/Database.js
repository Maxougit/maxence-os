import React, { useState } from "react";

const skillsData = {
  Programation: [
    {
      Name: "C#",
      Details: ["WPF", "UWP", "API", ".NET", "ORM"],
    },
    {
      Name: "C++",
      Details: ["Game Development", "Systems Programming"],
    },
    {
      Name: "Python",
      Details: ["Data Analysis", "Machine Learning", "Web Development"],
    },
    {
      Name: "JavaScript",
      Details: ["React", "Angular", "Vue"],
    },
    {
      Name: "PHP",
      Details: ["Web Development", "CMS", "Backend"],
    },
    {
      Name: "Rust",
      Details: ["Systems Programming", "Performance"],
    },
    {
      Name: "SQL",
      Details: ["Database Design", "Optimization"],
    },
    {
      Name: "HTML/CSS",
      Details: ["Web Design", "Responsive Layouts"],
    },
  ],
  Technologies: [
    {
      Name: "Node.js",
      Details: ["Server-Side Programming", "API Development"],
    },
    {
      Name: "Git",
      Details: ["Version Control", "Collaboration"],
    },
    {
      Name: "Docker",
      Details: ["Containerization", "Microservices"],
    },
    {
      Name: "Blockchain",
      Details: ["Smart Contracts", "DApps"],
    },
    {
      Name: "Linux",
      Details: ["Ubuntu Server", "CentOS", "Debian"],
    },
    {
      Name: "Arduino",
      Details: ["Embedded Systems", "IoT Projects"],
    },
  ],
  Concepts: [
    {
      Name: "Decentralization",
      Details: ["Blockchain", "P2P Networks"],
    },
    {
      Name: "Self-Hosting",
      Details: ["Personal Data Management", "Custom Servers"],
    },
    {
      Name: "Networking",
      Details: ["LAN/WAN", "Cisco Devices"],
    },
    {
      Name: "Big Data",
      Details: ["Data Analysis", "ETL Processes", "Business Intelligence"],
    },
  ],
};

const Database = () => {
  const [selectedCategory, setSelectedCategory] = useState("Schema");

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const generateSQLQuery = (category) => {
    if (category === "Schema") {
      return "SELECT * FROM Maxence;";
    }
    return `FROM Maxence SELECT ${category}`;
  };

  return (
    <div className="flex flex-col h-auto w-auto bg-gray-100 p-4">
      <div className="flex space-x-2 mb-4">
        {["Schema", "Programation", "Technologies", "Concepts"].map(
          (tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                selectedCategory === tab
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
              onClick={() => handleSelectCategory(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={generateSQLQuery(selectedCategory)}
          readOnly
          className="w-full px-4 py-2 bg-grey border border-gray-300 rounded-md"
        />
      </div>
      {selectedCategory !== "Schema" && (
        <div className="flex-grow bg-white border border-gray-200 rounded-md overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skillsData[selectedCategory]?.map((skill, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {skill.Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {skill.Details.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Ici, vous pouvez ajouter la logique pour afficher votre schéma relationnel pour l'onglet "Schema" */}
    </div>
  );
};

export default Database;
