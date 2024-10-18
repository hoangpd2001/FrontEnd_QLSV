import React from 'react'
import "./EmployeeSkill.css";
import FilterHeader from '../../../component/FilterHeader/FilterHeader';
import FilterSidebar from '../../../component/FilterSidebar/FilterSidebar';
import { useState ,useEffect} from 'react';
import { Filter,Pencil,CircleX } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../../../api/apiConfig'
const SKILL_API_URL=API.APIALL;
const SKILL_EMPLOYEE_API_URL=API.APIALL;
const NHANVIEN_API_URL=API.APIALL;
const EmployeeSkill = () => {
const [selectAll, setSelectAll] = useState(false);
const [selectedItems, setSelectedItems] = useState([]);
const [insertS, setInsertS] = useState(false);
const [insertSE, setInsertSE] = useState(false);

const [editingIdS, setEditingIdS] = useState(null); 
const [editSE, setEditSE] = useState(false);
const [editS, setEditS] = useState(false);
const [editingIdSE, setEditingIdSE] = useState(null);
const [nhanvien,setNhanvien]=useState([]);
const [nhanvienData,setNhanvienData]=useState();
const [skill,setSkill]=useState([]);
const [skillData,setSkillData]=useState({TenKyNang:"",MoTa:""});
const [skillemployee,setSkillemployee]=useState([]);
const [skillemployeeOne,setSkillemployeeOne]=useState([]);
const [skillemployeeData,setSkillemployeeData]=useState({IDNhanVien:"",IDKyNang:"",MucDo:"",NgayDanhGia:""});
useEffect(()=>{
  fetchSkill();
  fetchSkill_Employee();
  fetchSEmployee();
},[]);
const fetchSEmployee = async () => {
  try {
    const response = await fetch(`${NHANVIEN_API_URL}user/selectAll`);
    const result = await response.json();
    const data = await result.Data;
    setNhanvien(data);
  } catch (error) {
    console.error('Error fetching employee types:', error);
  }
}; 
const fetchSkill_Employee = async () => {
  try {
    const response = await fetch(`${SKILL_EMPLOYEE_API_URL}user/skilluser/select/`);
    const result = await response.json();
    const data = await result.Data;
    setSkillemployee(data);
  } catch (error) {
    console.error('Error fetching employee types:', error);
  }
}; 
const fetchSkill = async () => {
  try {
    const response = await fetch(`${SKILL_API_URL}user/skill/selectAll`);
    const result = await response.json();
    const data = await result.Data;
    setSkill(data);
    setSelectedItems(data.map(() => false)); 
  } catch (error) {
    console.error('Error fetching employee types:', error);
  }
};
const handleSelectAllChange = (event) => {
      const checked = event.target.checked;
      setSelectAll(checked);
      setSelectedItems(selectedItems.map(() => checked));
};
const handleItemChange = (index) => (event) => {
      const checked = event.target.checked;
      const updatedSelectedItems = [...selectedItems];
      updatedSelectedItems[index] = checked;
      setSelectedItems(updatedSelectedItems);
      const allChecked = updatedSelectedItems.every((item) => item);
      setSelectAll(allChecked);
};
const handleRemoveSelected = async () => {
  const selectedIds = employeeTypes
      .filter((_, index) => selectedItems[index])
      .map(item => item.ID);

  if (selectedIds.length === 0) {
      toast.warning('Không có mục nào được chọn để xóa!', {
          position: "top-right",
      });
      return;
  }

  try {
      await Promise.all(selectedIds.map(id =>
          fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
          })
      ));
      toast.success('Các loại nhân viên đã được xóa thành công!', {
          position: "top-right",
      });
      fetchEmployeeTypes(); 
  } catch (error) {
      toast.error('Xóa không thành công: ' + error.message, {
          position: "top-right",
      });
  }
};
const openInsertS = () => {
  setInsertS(true);
};
const openInsertSE = () => {
    
  setInsertSE(true);
};
const closeInsertS = () => {
  setInsertS(false);
  setSkillData({TenKyNang:"",MoTa:""});
};
const closeInsertSE = () => {
  setInsertSE(false);
  setSkillemployeeData({IDNhanVien:"",IDKyNang:"",MucDo:"",NgayDanhGia:""});
};
const openEditS = (idk, id) => {
  const skillToEdit = skillemployee.find(item => item.IDNhanVien == id && item.IDKyNang == idk);
  setSkillemployeeData(skillToEdit);
  setEditS(true);
};
const closeEditS = () => {
  setEditS(false);
  setSkillemployeeData({IDNhanVien:"",IDKyNang:"",MucDo:"",NgayDanhGia:""});
};
const openEditSE = (id) => {
  setEditingIdSE(id);
  const employeesInGroup = skillemployee.filter(item => item.IDKyNang === id);
    const filteredSkills = skillemployee.filter(skill => skill.IDNhanVien == id);
    setSkillemployeeOne([...filteredSkills]); 
  setSkillemployeeData({ ...skillemployeeData, employeesInGroup });
  setEditSE(true);
};
const closeEditSE = () => {
  setEditSE(false);
  setSkillemployeeData({IDNhanVien:"",IDKyNang:"",MucDo:"",NgayDanhGia:""});
};
const handleChangeS = (e) => {
  const { name, value } = e.target;
  setSkillData(prevData => ({
    ...prevData,
    [name]: value
  }));
};
const getEmployeeNameById = (id) => {
  const employee = nhanvien.find(item => item.ID === id);
  return employee ? `${employee.Ho} ${employee.Dem} ${employee.Ten}` : '';
};
const getSkillNameById = (id) => {
  const skil = skill.find(item => item.ID == id);
  return skil ? skil.TenKyNang : '';
};
const countSkillById = (id) => {
    var number = [];

   number =  skillemployee.filter(item => item.IDNhanVien == id);
  return number ? number.length : 0;
}
const handleChangeSE = (e) => {
  const { name, value } = e.target;
  setSkillemployeeData(prevData => ({
    ...prevData,
    [name]: value
  }));
};
const handleSaveS = async (e) => {
  e.preventDefault();
  const isDuplicate = skill.some(item => item.TenKyNang === skillData.TenKyNang);
      if (isDuplicate) {
          toast.error('Kỹ Năng đã tồn tại!', {
              position: "top-right",
          });
          return;
      }
  try {
    const newNhomnhanvien = { ...skillData };
    const response = await fetch(SKILL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNhomnhanvien),
    });
    const result =await response.json();
             if (result.StatusCode !=  200) {
            const errorMessage = await result.Message;
            throw new Error(`${errorMessage}`);
          }
    toast.success('Kỹ Năng mới đã được tạo thành công!', {
      position: "top-right",
    });
    fetchSkill(); 
    closeInsertS();
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const handleSaveSE = async (e) => {
  e.preventDefault();
  const isDuplicate = skillemployee.some(item => item.IDNhanVien === skillemployeeData.IDNhanVien && item.IDKyNang === skillemployeeData.IDKyNang);
      if (isDuplicate) {
          toast.error(' Nhân Viên đã có kĩ năng này!', {
              position: "top-right",
          });
          return;
      }
  try {
    const newNhomnhanvien = { ...skillemployeeData, IDNhanVien: editingIdSE};
    newNhomnhanvien.MucDo = parseInt(newNhomnhanvien.MucDo)
    newNhomnhanvien.IDKyNang = parseInt(newNhomnhanvien.IDKyNang)
    const response= await fetch(`${SKILL_EMPLOYEE_API_URL}user/skilluser/creat/?id=${newNhomnhanvien.IDNhanVien}&ids=${newNhomnhanvien.IDKyNang}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNhomnhanvien),
    });
    console.log(newNhomnhanvien);
    const result =await response.json();
             if (result.StatusCode !=  200) {
            const errorMessage = await result.Message;
            throw new Error(`${errorMessage}`);
          }
    toast.success('Kỹ Năng Nhân viên mới đã được tạo thành công!', {
      position: "top-right",
    });
     fetchSkill_Employee();
     setSkillemployeeOne(prevSkills => [...prevSkills, newNhomnhanvien]);
    closeInsertSE();
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const handleEditS = async (e) => {
  e.preventDefault();
  if (!editingIdS) return; 
  try {
    const response = await fetch(`${SKILL_API_URL}/${editingIdS}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData),
    });
    const result =await response.json();
             if (result.StatusCode !=  200) {
            const errorMessage = await result.Message;
            throw new Error(`${errorMessage}`);
          }

    toast.success('Thông tin kỹ năng đã cập nhật', {
      position: "top-right",
    });
    fetchSkill(); 
    closeEditS(); 
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const handleEditSE = async (e,id, ids) => {
  e.preventDefault();
 skillemployeeData.MucDo = parseInt(skillemployeeData.MucDo)
  try {
    const response = await fetch(`${SKILL_API_URL}user/skilluser/update/?id=${id}&ids=${ids}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillemployeeData),
    });
    console.log(skillemployeeData)
    const result =await response.json();
             if (result.StatusCode !=  200) {
            const errorMessage = await result.Message;
            throw new Error(`${errorMessage}`);
          }
    toast.success('Thông tin kỹ năng đã cập nhật', {
      position: "top-right",
    });
     fetchSkill_Employee();
    setSkillemployeeOne(prevSkills => 
        prevSkills.filter(item => 
            !(item.IDNhanVien == id && item.IDKyNang == ids)
        )
    );
     setSkillemployeeOne(prevSkills => [...prevSkills, skillemployeeData]);
    closeEditS(); 
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const handleRemoveS = async (id) => {
  if (!id) return; 
  try {
    const response =  await fetch(`${SKILL_API_URL}/${id}`, {
      method: 'DELETE',
    });
    const result =await response.json();
             if (result.StatusCode !=  200) {
            const errorMessage = await result.Message;
            throw new Error(`${errorMessage}`);
          }
    toast.success('Kỹ Năng đã được xóa thành công!', {
      position: "top-right",
    });
    fetchSkill(); 
    closeEditS(); 
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const handleRemoveSE = async (id, ids) => {
  if (!id) return; 
  try {
    await fetch(`${SKILL_EMPLOYEE_API_URL}user/skilluser/delete/?id=${id}&ids=${ids}`, {
      method: 'DELETE',
    });
    toast.success('Nhân viên đã được xóa kỹ năng thành công!', {
      position: "top-right",
    });
       
    fetchSkill_Employee(); 
     setSkillemployeeOne(prevSkills => 
        prevSkills.filter(item => 
            !(item.IDNhanVien == id && item.IDKyNang == ids)
        )
    );
    closeEditS(); 
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
    });
  }
};
const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const d= date.toISOString().split('T')[0];
    if(d == "0001-01-01") return "" 
    return d
  };
  return (
    <div className='employee-skill-map'>
        <FilterHeader handleRemoveSelected={handleRemoveSelected}/>
        <FilterSidebar/>
        <div className='employee-skill-map-table'>
        <div className="employee-skill-map-table-header">
              <div className="employee-skill-map-search-filter">
                  <input className="employee-skill-map-search-filter-input" type="text" placeholder='Tìm Kiếm' />
              </div>
              <div className="employee-skill-map-insert">
                  
              </div>
              {insertS && (
            <div className='overlay'>
              <div className='employee-type-insert'>
                <div className='employee-type-insert-insert'>
                  <div className="employee-type-title-insert">
                    Thêm Kỹ Năng
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSaveS}>
                      <input type="text" onChange={handleChangeS} name="TenKyNang"  placeholder="Nhập Tên Kỹ Năng"  required />
                      <input type="text" onChange={handleChangeS} name="MoTa" placeholder="Nhập Mô Tả"  required/>
                      <div className="employee-type-save">
                        <button className="employee-type-save-save" type="submit">Lưu</button>
                        <button className="employee-type-save-exit" type="button"  onClick={closeInsertS}>X</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
              )}
              
              <div className="employee-skill-map-filter">
                  <button className='employee-skill-map-filter-coponent'><Filter className="filter-icon"/><span>Bộ Lọc</span></button>
                  <button className='employee-skill-map-filter-coponent'><div className="filter-icon"/><span>Tác Vụ</span></button>
              </div>
        </div>
        <div className="employee-skill-map-table-filter">
        <div className="employee-skill-map-table-contain">
            <div className="employee-skill-map-format-title">
            <td><input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></td>
            <td><b>IDNV</b></td>
            <td><b>Tên Nhân Viên</b></td>
            <td><b>Số Kĩ Năng</b></td>
            <b></b>
        </div>
            {nhanvien.map((item,index) => {
              return (
              <div  className='employee-skill-map-format' key={item.ID}>
                    <td ><input type="checkbox"  checked={selectedItems[index]} onChange={handleItemChange(index)} /></td>
                    <td onClick={() => openEditSE(item.ID)}>{item.ID}</td>
                    <td onClick={() => openEditSE(item.ID)}>{item.Ho + " "+item.Dem +" "+ item.Ten}</td>
                    <td onClick={() => openEditSE(item.ID)}>{countSkillById(item.ID)}</td>
                    <td onClick={() => openEditSE(item.ID)}>{item.MoTa}</td>
                    
                  
                    {editSE && editingIdSE === item.ID && (
                <div className='overlay'>
                  <div className='insert-group-employee'>
                    <div className='insert-insert-group-employee'>
                      <div className="title-insert-group-employee">
                          Danh sách Kỹ Năng nhân viên: <b>{getEmployeeNameById(editingIdSE)}</b>
                      </div>
                      <table>
                        <thead>
                          <tr>
                          <th>STT</th>
                          <th>Tên kỹ năng</th>
                          <th>Mức Độ</th>
                          <th>Ngày Đánh Giá</th>
                          <th>Edit</th>
                          </tr>
                        </thead>
                      <tbody>
                      {skillemployeeOne
                      .map((item, index) => (
                      <tr key={item.ID}>
                        <td>{index + 1}</td>
                        <td>{getSkillNameById(item.IDKyNang)}</td>
                        
                         <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star}>
                                        <input 
                                            type="radio" 
                                            name="MucDo" 
                                            value={star} 
                                            onChange={handleChangeSE} 
                                            checked={item.MucDo == star} 
                                            required 
                                        />
                                        <span className={`star ${item.MucDo >= star ? 'filled' : ''}`}>&#9733;</span>
                                        </label>
                                    ))}
                                    </div>


                        <td>{formatDate(item.NgayDanhGia)}</td>
                        <td onClick={() => openEditS(item.IDKyNang, item.IDNhanVien)}><Pencil/></td>
                          
                          
                          {editS && (
                  <div className='overlay'>
                    <div className='insert'>
                      <div className='insert-insert'>
                        <div className="title-insert">
                          Cập Nhật Kỹ Năng
                        </div>
                        <form onSubmit={(e) => handleEditSE(e, skillemployeeData.IDNhanVien, skillemployeeData.IDKyNang)}>
                          <div className="input-insert">
                            <div>Tên Kỹ Năng</div>
                            <input  type="text"  onChange={handleChangeSE} value={skillemployeeData.IDKyNang}  name="IDKyNang"  required />
                            <div>Mức độ</div>
                            <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star}>
                                        <input 
                                            type="radio" 
                                            name="MucDo" 
                                            value={star} 
                                            onChange={handleChangeSE} 
                                            checked={skillemployeeData.MucDo == star} 
                                            required 
                                        />
                                        <span className={`star ${skillemployeeData.MucDo >= star ? 'filled' : ''}`}>&#9733;</span>
                                        </label>
                                    ))}
                                    </div>
                            <div>Ngày đào tạo</div>
                            <input  type="Date" onChange={handleChangeSE} value={formatDate(skillemployeeData.NgayDanhGia)}  name="NgayDanhGia"  required/>
                          </div>
                          <div className="save">
                            <button className="employee-type-save-save" type="submit" >Cập Nhật</button>
                            <button className="employee-type-save-exit" type="button" onClick={closeEditS}>X</button>
                            <button className="employee-type-save-remove" type="button" onClick={() => handleRemoveSE(skillemployeeData.IDNhanVien, skillemployeeData.IDKyNang)}>Xóa</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                    )}
                        
                      </tr>
                      ))}
                      </tbody>
                    </table>
                    <tr><br /></tr>
                    <br />
                      
                      <button className='employee-skill-map-insert-button' onClick={openInsertSE}> Thêm Kỹ Năng Nhân Viên </button>
                      <button type="button" id="butonDelete"  onClick={closeEditSE}>    X    </button>
                      {insertSE && (
            <div className='overlay'>
              <div className='employee-type-insert'>
                <div className='employee-type-insert-insert'>
                  <div className="employee-type-title-insert">
                    Thêm Kỹ Năng Nhân Viên
                  </div>
                  <div className="employee-type-input-insert">
                    <form onSubmit={handleSaveSE}>
                    <div>Tên Kỹ Năng</div>
                    <br />
                    <select name="IDKyNang" onChange={handleChangeSE} value={skillemployeeData.IDKyNang}>
                      <option >Chọn Kỹ Năng</option>
                      {skill.map(item => (
                      <option key={item.ID}  value={item.ID}>{item.TenKyNang}</option>
                      ))}
                    </select>
                    <br />
                   <div>Mức Độ</div>
                   
                    <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star}>
                                        <input 
                                            type="radio" 
                                            name="MucDo" 
                                            value={star} 
                                            onChange={handleChangeSE} 
                                            checked={skillemployeeData.MucDo == star} 
                                            required 
                                        />
                                        <span className={`star ${skillemployeeData.MucDo >= star ? 'filled' : ''}`}>&#9733;</span>
                                        </label>
                                    ))}
                                    </div>
                                    <br />
                    <div>Ngày Đánh Giá</div>
                    <br />
                    <input type="date" name="NgayDanhGia" onChange={handleChangeSE} value={skillemployeeData.NgayDanhGia} />
                    <br />
                    <br />
                      <div className="employee-type-save">
                        <button className="employee-type-save-save" type="submit">Lưu</button>
                        <button className="employee-type-save-exit" type="button" onClick={closeInsertSE}>X</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
              )}
                  </div>
              </div>
            </div>
              )}
              
              </div>
              );
            })}
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default EmployeeSkill
