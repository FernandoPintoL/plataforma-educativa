# ML Integration Endpoints Reference

## Base URL
```
http://localhost:8000/api/ml
```

**Authentication:** Requires `auth:sanctum` or Laravel session + professor or admin role

## Endpoints

### 1. Get Integrated Predictions for Student

**Endpoint:** `GET /api/ml/predict/{studentId}`

**Description:** Get complete integrated ML predictions for a student including:
- Risk prediction with potential LSTM anomaly escalation
- Career recommendation
- Performance trend
- Clustering assignment
- Anomaly detection analysis
- Cross-model coherence validation

**Parameters:**
- `studentId` (required, integer) - Student ID

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/ml/predict/123
```

**Example Response:**
```json
{
  "success": true,
  "student_id": 123,
  "predictions": {
    "risk": {
      "score_riesgo": 0.6,
      "nivel_riesgo": "medio",
      "confianza": 0.85,
      "modelo_version": "v2.0"
    },
    "carrera": {
      "carrera_predicha": "Ingeniería Informática",
      "compatibilidad": 0.88,
      "confianza": 0.92
    },
    "tendencia": {
      "tendencia": "mejorando",
      "confianza": 0.78
    },
    "cluster": {
      "cluster": 1,
      "cluster_probability": 0.82
    }
  },
  "validation": {
    "is_coherent": true,
    "inconsistencies": [],
    "confidence": 0.85
  },
  "anomaly_detection": {
    "is_anomaly": false,
    "anomaly_type": null,
    "anomaly_score": 0.2
  },
  "timestamp": "2024-11-26T10:30:00Z"
}
```

**HTTP Status Codes:**
- `200` - Predictions generated successfully
- `404` - Student not found
- `500` - Error in ML system

---

### 2. Record Prediction Feedback

**Endpoint:** `POST /api/ml/feedback`

**Description:** Record the actual outcome for a prediction to complete the feedback loop. This enables the system to measure accuracy and improve models.

**Request Body:**
```json
{
  "student_id": 123,
  "type": "risk|carrera|tendencia|cluster",
  "actual_value": "actual_outcome_value"
}
```

**Parameters:**
- `student_id` (required, integer) - Student ID
- `type` (required, string) - Prediction type: `risk`, `carrera`, `tendencia`, `progreso`, `cluster`, or `anomaly`
- `actual_value` (required, mixed) - The actual outcome that occurred

**Example Request (Risk):**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 123,
    "type": "risk",
    "actual_value": "Student performed well, risk was low"
  }' \
  http://localhost:8000/api/ml/feedback
```

**Example Request (Career):**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 123,
    "type": "carrera",
    "actual_value": "Ingeniería Informática"
  }' \
  http://localhost:8000/api/ml/feedback
```

**Example Response:**
```json
{
  "success": true,
  "message": "Feedback registered successfully"
}
```

**HTTP Status Codes:**
- `200` - Feedback recorded successfully
- `422` - Validation error (invalid type, missing student, etc.)
- `500` - Error recording feedback

---

### 3. Get ML Dashboard

**Endpoint:** `GET /api/ml/dashboard`

**Description:** Get comprehensive ML system monitoring dashboard with metrics, alerts, and status.

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/ml/dashboard
```

**Example Response:**
```json
{
  "success": true,
  "performance_summary": {
    "period_days": 30,
    "total_predictions": 1250,
    "correct_predictions": 1125,
    "overall_accuracy": 90.0,
    "average_error_percentage": 5.2,
    "average_confidence": 0.87,
    "metrics_by_type": {
      "risk": {
        "total": 400,
        "correct": 380,
        "accuracy": 95.0,
        "avg_error": 3.1
      },
      "carrera": {
        "total": 350,
        "correct": 315,
        "accuracy": 90.0,
        "avg_error": 6.2
      },
      "tendencia": {
        "total": 300,
        "correct": 270,
        "accuracy": 90.0,
        "avg_error": 5.5
      },
      "cluster": {
        "total": 200,
        "correct": 160,
        "accuracy": 80.0,
        "avg_error": 8.2
      }
    }
  },
  "degradation_analysis": {
    "degradation_detected": false,
    "recent_accuracy": 90.5,
    "baseline_accuracy": 89.8,
    "accuracy_drop_percentage": -0.7,
    "alerts": []
  },
  "review_queue": {
    "total_in_review": 8,
    "items": [
      {
        "id": 456,
        "student_id": 123,
        "student_name": "Juan García",
        "type": "risk",
        "confidence": 0.45,
        "error_percentage": 28.5,
        "review_reason": "Low confidence and high error"
      }
    ]
  },
  "pending_feedback": {
    "total_pending": 45,
    "items": [
      {
        "id": 789,
        "student_id": 456,
        "student_name": "María López",
        "type": "carrera",
        "predicted_value": ["Psicología"],
        "confidence": 0.88,
        "days_pending": 8
      }
    ]
  },
  "alerts": [
    {
      "type": "pending_feedback",
      "severity": "info",
      "message": "45 predictions awaiting feedback"
    }
  ],
  "timestamp": "2024-11-26T10:35:00Z"
}
```

---

### 4. Get Performance Metrics

**Endpoint:** `GET /api/ml/metrics`

**Description:** Get detailed performance metrics for a specified time period.

**Query Parameters:**
- `days` (optional, integer) - Period in days (default: 30)
- `type` (optional, string) - Filter by prediction type

**Example Request:**
```bash
# Last 7 days, all types
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/metrics?days=7"

# Last 30 days, only risk predictions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/metrics?days=30&type=risk"
```

**Example Response:**
```json
{
  "success": true,
  "period_days": 7,
  "total_predictions": 245,
  "correct_predictions": 230,
  "overall_accuracy": 93.88,
  "average_error_percentage": 4.1,
  "average_confidence": 0.89,
  "accuracy_distribution": {
    "excellent": 150,
    "good": 65,
    "fair": 20,
    "poor": 10
  },
  "metrics_by_type": {
    "risk": {...},
    "carrera": {...},
    "tendencia": {...},
    "cluster": {...}
  },
  "timestamp": "2024-11-26T10:40:00Z"
}
```

---

### 5. Get Review Queue

**Endpoint:** `GET /api/ml/review-queue`

**Description:** Get predictions that need manual review (low confidence, high error, or edge cases).

**Query Parameters:**
- `limit` (optional, integer) - Maximum predictions to return (default: 50)

**Example Request:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/review-queue?limit=20"
```

**Example Response:**
```json
{
  "success": true,
  "total_in_review": 12,
  "items": [
    {
      "id": 456,
      "student_id": 123,
      "student_name": "Juan García",
      "type": "risk",
      "confidence": 0.42,
      "error_percentage": 35.2,
      "review_reason": "High error (35.2%) or low confidence (0.42)",
      "created_at": "2024-11-20T09:15:00Z"
    },
    {
      "id": 457,
      "student_id": 124,
      "student_name": "Ana Martínez",
      "type": "carrera",
      "confidence": 0.51,
      "error_percentage": 28.0,
      "review_reason": "High error (28.0%) or low confidence (0.51)",
      "created_at": "2024-11-21T14:30:00Z"
    }
  ],
  "timestamp": "2024-11-26T10:45:00Z"
}
```

---

### 6. Get Pending Feedback

**Endpoint:** `GET /api/ml/pending-feedback`

**Description:** Get predictions that are awaiting actual outcome to complete the feedback loop.

**Query Parameters:**
- `days` (optional, integer) - Minimum age of predictions (default: 7)
- `limit` (optional, integer) - Maximum to return (default: 50)

**Example Request:**
```bash
# Predictions 7+ days old
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/pending-feedback"

# Predictions 14+ days old, max 25
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/pending-feedback?days=14&limit=25"
```

**Example Response:**
```json
{
  "success": true,
  "total_pending": 87,
  "older_than_days": 7,
  "items": [
    {
      "id": 789,
      "student_id": 456,
      "student_name": "María López",
      "type": "carrera",
      "predicted_value": ["Psicología"],
      "confidence": 0.88,
      "days_pending": 10
    },
    {
      "id": 790,
      "student_id": 457,
      "student_name": "Carlos Ruiz",
      "type": "tendencia",
      "predicted_value": ["mejorando"],
      "confidence": 0.76,
      "days_pending": 14
    }
  ],
  "timestamp": "2024-11-26T10:50:00Z"
}
```

---

### 7. Check Performance Degradation

**Endpoint:** `GET /api/ml/degradation`

**Description:** Compare model performance between recent period and baseline to detect degradation.

**Query Parameters:**
- `recent` (optional, integer) - Days for recent period (default: 7)
- `baseline` (optional, integer) - Days for baseline period (default: 30)

**Example Request:**
```bash
# Compare last 7 days vs previous 30 days
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/degradation"

# Compare last 14 days vs previous 60 days
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/ml/degradation?recent=14&baseline=60"
```

**Example Response:**
```json
{
  "success": true,
  "degradation_detected": false,
  "recent_period_days": 7,
  "baseline_period_days": 30,
  "recent_accuracy": 92.5,
  "baseline_accuracy": 89.8,
  "accuracy_drop_percentage": -2.7,
  "recent_confidence": 0.89,
  "baseline_confidence": 0.87,
  "confidence_drop": -0.02,
  "alerts": [],
  "type_issues": [],
  "timestamp": "2024-11-26T10:55:00Z"
}
```

**Alert Conditions:**
- Accuracy drop > 5% (warning) or > 15% (critical)
- Confidence drop > 0.1 (warning) or > 0.2 (critical)
- Per-type accuracy drop > 10%

---

## Usage Examples

### Example 1: Complete Prediction Workflow

```bash
# Step 1: Get predictions for student 123
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/predict/123 | jq

# Step 2: Monitor dashboard
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/dashboard | jq

# Step 3: Check for predictions needing review
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/review-queue | jq

# Step 4: Once actual outcome is known, record feedback
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 123,
    "type": "risk",
    "actual_value": "Low risk - student excelled"
  }' \
  http://localhost:8000/api/ml/feedback

# Step 5: Monitor pending feedback
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/pending-feedback | jq
```

### Example 2: Monitor System Health

```bash
# Get all metrics
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/dashboard | jq '.alerts'

# Check for degradation
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8000/api/ml/degradation" | jq '.degradation_detected'

# Get performance by type
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:8000/api/ml/metrics | jq '.metrics_by_type'
```

### Example 3: Daily Feedback Recording

Use the Artisan command to automatically record feedback:

```bash
# Run hourly (cron job)
php artisan ml:record-feedback

# Run for specific student
php artisan ml:record-feedback --student-id=123

# Run for older predictions
php artisan ml:record-feedback --days=14 --limit=50
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 422 | Validation error |
| 500 | Server error |

---

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Error details (if available)",
  "errors": {
    "field_name": ["Error message for field"]
  }
}
```

---

## Implementation Notes

1. **Authentication:** All endpoints require Laravel Sanctum token or valid session
2. **Authorization:** Endpoints require `profesor` or `admin` role
3. **Logging:** All operations are logged for audit trail
4. **Rate Limiting:** Consider implementing rate limiting for production
5. **Caching:** Dashboard metrics can be cached for 5 minutes if needed

---

## Common Tasks

### Monitor Model Performance
1. Call `/api/ml/metrics` regularly (daily/weekly)
2. Track `overall_accuracy` and `average_error_percentage`
3. Monitor `metrics_by_type` for per-type performance
4. Set alerts if accuracy drops below threshold

### Complete Feedback Loop
1. Call `/api/ml/pending-feedback` to find old predictions
2. Research actual outcomes for those students
3. Call `/api/ml/feedback` to record actual results
4. Or run `php artisan ml:record-feedback` hourly

### Review Model Predictions
1. Call `/api/ml/review-queue` to see flagged predictions
2. Examine the `error_percentage` and `confidence`
3. Investigate why those predictions were wrong
4. Potentially trigger model retraining

### Detect Model Degradation
1. Call `/api/ml/degradation` with desired periods
2. Check `degradation_detected` flag
3. Review `alerts` array for specific issues
4. Investigate `type_issues` to find problematic prediction types

---

**Version:** 1.0
**Last Updated:** 2024-11-26
**Status:** Production Ready
