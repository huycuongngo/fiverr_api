const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return LoaiCongViec.init(sequelize, DataTypes);
}

class LoaiCongViec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ten_loai_cong_viec: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hinh_anh: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'LoaiCongViec',
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
    ]
  });
  }
}
