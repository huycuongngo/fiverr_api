const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return BinhLuan.init(sequelize, DataTypes);
}

class BinhLuan extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ngay_gio_binh_luan: {
      type: DataTypes.DATE,
      allowNull: true
    },
    noi_dung: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sao_binh_luan: {
      type: DataTypes.INTEGER,
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
    ma_nguoi_binh_luan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'NguoiDung',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'BinhLuan',
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
        name: "ma_nguoi_binh_luan",
        using: "BTREE",
        fields: [
          { name: "ma_nguoi_binh_luan" },
        ]
      },
    ]
  });
  }
}
