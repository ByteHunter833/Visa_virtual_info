from flask import Flask, jsonify, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pandas as pd
from uuid import uuid4
import os

app = Flask(__name__)
CORS(app)  # Разрешить CORS для фронтенда

# Конфигурация базы данных
# Используем PostgreSQL в продакшене, SQLite для локальной разработки
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///visa_regimes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Модель для таблицы visa_regimes
class VisaRegime(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    country_code = db.Column(db.String(10))
    country_name = db.Column(db.String(100))
    visa_policy = db.Column(db.Text)
    language = db.Column(db.String(3))  # 'uzb' или 'rus'

    def __repr__(self):
        return f'<VisaRegime {self.country_code} ({self.language})>'

    def to_dict(self):
        code = self.country_code.lower()
        flag_url = f"https://flagcdn.com/56x42/{code[:2] if len(code) == 3 else code[:2]}.png"
        return {
            'id': self.id,
            'country_code': self.country_code,
            'country_name': self.country_name,
            'visa_policy': self.visa_policy,
            'language': self.language,
            'flag_url': flag_url
        }

# Функция для очистки строковых данных
def clean_string(value):
    if isinstance(value, str):
        return value.strip().replace('\n', ' ').replace('\r', ' ')
    return value

# Маршрут для загрузки данных из обоих файлов
@app.route('/upload', methods=['POST'])
def upload_data():
    try:
        df_uzb = pd.read_excel("O`zbek tili.xlsx", engine='openpyxl')
        df_uzb.columns = ['country_code', 'country_name', 'visa_policy']
        df_uzb['language'] = 'uzb'

        df_rus = pd.read_excel("Rus tili.xlsx", engine='openpyxl')
        df_rus.columns = ['country_code', 'country_name', 'visa_policy']
        df_rus['language'] = 'rus'

        df = pd.concat([df_uzb, df_rus], ignore_index=True)

        df['country_code'] = df['country_code'].apply(clean_string)
        df['country_name'] = df['country_name'].apply(clean_string)
        df['visa_policy'] = df['visa_policy'].apply(clean_string)
        df = df.dropna(how='all')

        with app.app_context():
            db.session.query(VisaRegime).delete()
            db.session.commit()

        for _, row in df.iterrows():
            visa_regime = VisaRegime(
                country_code=row['country_code'],
                country_name=row['country_name'],
                visa_policy=row['visa_policy'],
                language=row['language']
            )
            db.session.add(visa_regime)

        db.session.commit()
        return jsonify({'message': 'Данные успешно загружены', 'count': len(df)})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Маршрут для получения всех данных
@app.route('/visa_regimes', methods=['GET'])
def get_visa_regimes():
    lang = request.args.get('lang')
    if lang == 'uz':
        lang = 'uzb'
    if lang not in ['uzb', 'rus']:
        return jsonify({'error': 'Укажите язык: lang=uz (или uzb) или lang=rus'}), 400

    regimes = VisaRegime.query.filter_by(language=lang).all()
    return jsonify([regime.to_dict() for regime in regimes])

# Маршрут для получения данных по стране
@app.route('/visa_regimes/<code>', methods=['GET'])
def get_visa_regime_by_code(code):
    lang = request.args.get('lang')
    if lang == 'uz':
        lang = 'uzb'
    if lang not in ['uzb', 'rus']:
        return jsonify({'error': 'Укажите язык: lang=uz (или uzb) или lang=rus'}), 400

    regime = VisaRegime.query.filter_by(country_code=code, language=lang).first()
    if not regime:
        return jsonify({'error': 'Страна не найдена'}), 404

    return jsonify(regime.to_dict())

# Инициализация базы данных
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

