const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return CongViec.init(sequelize, DataTypes);
}

class CongViec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_cong_viec: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    danh_gia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gia_tien: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hinh_anh: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mo_ta: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    mo_ta_ngan: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sao_cong_viec: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ma_chi_tiet_loai: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ChiTietLoaiCongViec',
        key: 'id'
      }
    },
    nguoi_tao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'NguoiDung',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'CongViec',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "ma_chi_tiet_loai",
        using: "BTREE",
        fields: [
          { name: "ma_chi_tiet_loai" },
        ]
      },
      {
        name: "nguoi_tao",
        using: "BTREE",
        fields: [
          { name: "nguoi_tao" },
        ]
      },
    ]
  });
  }
}
