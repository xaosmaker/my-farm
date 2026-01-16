package utils

import (
	"testing"
	"time"
)

func toPtr[T any](input T) *T {
	return &input

}

func TestUnsafeTimeConvShouldPass(t *testing.T) {
	cases := []struct {
		name     string
		input    *string
		expected *time.Time
	}{
		{"valid RFC3339 with milliseconds", toPtr("2026-12-12T00:00:00.00Z"), toPtr(time.Date(2026, time.December, 12, 0, 0, 0, 0, time.UTC))},
		{"valid RFC3339 without milliseconds", toPtr("2026-12-12T00:00:00Z"), toPtr(time.Date(2026, time.December, 12, 0, 0, 0, 0, time.UTC))},
		{"nil input", nil, nil},
		{"empty string", toPtr(""), nil},                // unsafe parse returns zero time, but you can treat as nil
		{"wrong format", toPtr("soething random"), nil}, // unsafe parse returns zero time, but you can treat as nil
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			res := UnsafeStrToTimeConverter(c.input)

			if res == nil && c.expected == nil {
				return // both nil, test passes
			}

			if res == nil || !res.Equal(*c.expected) {
				t.Fatalf("expected %v, got %v", c.expected, res)
			}
		})

	}

}
