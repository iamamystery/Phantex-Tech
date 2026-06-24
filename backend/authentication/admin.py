from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import WhitelistedEmail, UserLoginLog

@admin.register(WhitelistedEmail)
class WhitelistedEmailAdmin(ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    search_fields = ('email',)
    list_filter = ('is_active',)

@admin.register(UserLoginLog)
class UserLoginLogAdmin(ModelAdmin):
    list_display = ('user', 'ip_address', 'timestamp', 'success')
    readonly_fields = ('user', 'ip_address', 'user_agent', 'timestamp', 'success')
    search_fields = ('user__email', 'ip_address')
    list_filter = ('success', 'timestamp')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
