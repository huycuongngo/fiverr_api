const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return ThueCongViec.init(sequelize, DataTypes);
}

class ThueCongViec extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ngay_gio_thue: {
      type: DataTypes.DATE,
      allowNull: true
    },
    hoan_thanh: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ma_cong_viec: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CongViec',
        key: 'id'
      }
    },
    ma_nguoi_thue: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'NguoiDung',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'ThueCongViec',
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
        name: "ma_cong_viec",
        using: "BTREE",
        fields: [
          { name: "ma_cong_viec" },
        ]
      },
      {
        name: "ma_nguoi_thue",
        using: "BTREE",
        fields: [
          { name: "ma_nguoi_thue" },
        ]
      },
    ]
  });
  }
}
