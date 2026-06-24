from rest_framework import serializers
from .models import HowWeWorkSettings, WorkProcessStep

class HowWeWorkSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowWeWorkSettings
        fields = '__all__'

class WorkProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkProcessStep
        fields = '__all__'
