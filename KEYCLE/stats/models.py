from django.db import models

# Create your models here.
class Stats(models.Model):
	questionId = models.AutoField(primary_key = True)
	correctAnswer = models.IntegerField()

	class Meta:
		# 모델의 내용이 변경 가능하면 Ture, 변경 불가능하면 False 
		managed = False
		db_table = 'Stats'