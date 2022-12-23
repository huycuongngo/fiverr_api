const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ChiTietLoaiCongViec.init(sequelize, DataTypes);
}

class ChiTietLoaiCongViec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    ma_loai_cong_viec: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'LoaiCongViec',
        key: 'id'
      }
    },
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_chi_tiet: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hinh_anh: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ChiTietLoaiCongViec',
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
        name: "ma_loai_cong_viec",
        using: "BTREE",
        fields: [
          { name: "ma_loai_cong_viec" },
        ]
      },
    ]
  });
  }
}
